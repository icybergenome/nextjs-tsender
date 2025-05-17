"use client";

import InputField from "@/components/ui/InputField";
import { useEffect, useMemo, useState } from "react";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import {
  useChainId,
  useConfig,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContracts,
} from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { calculateTotal } from "@/utils";

export default function AirdropForm() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const total: number = useMemo(() => calculateTotal(amounts), [amounts]);
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, isError } = useWaitForTransactionReceipt({
    hash,
    confirmations: 1,
  })

  const {data: tokenData, status} = useReadContracts({
    contracts: [
        {
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "name"
        },
        {
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "decimals"
        },
    ]
  })

  async function getApprovedAmount(tsenderAddress: string): Promise<number> {
    if (!tsenderAddress) {
      alert("No address found, please use a supported chain");
      return 0;
    }
    // read from the chain to see if we have enough tokens(allowance)
    const response = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [account.address, tsenderAddress],
    });
    return response as number;
  }

  async function handleSubmit() {
    // 1a. If already approved, moved to step 2
    // 1b. Approve our tsender contract to send our tokens
    // 2. Call the Airdrop function on the tsender contract
    // 3. Wait for the transaction to be mined
    const tSenderAddress = chainsToTSender[chainId]["tsender"];
    const approvedAmount = await getApprovedAmount(tSenderAddress);
    console.log("approvedAmount", approvedAmount);
    console.log("total", total);
    if (approvedAmount < total) {
    const approvalHash = await writeContractAsync({
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "approve",
        args: [tSenderAddress as `0x${string}`, BigInt(total)],
    });
    const approvalReceipt = await waitForTransactionReceipt(config, {
        hash: approvalHash as `0x${string}`,
    });
    console.log("Approval Confirmed", approvalReceipt);
    await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
        tokenAddress as `0x${string}`,
        // Comma or new line separated
        recipients
            .split(/[,\n]+/)
            .map((addr) => addr.trim())
            .filter((addr) => addr !== ""),
        amounts
            .split(/[,\n]+/)
            .map((amt) => amt.trim())
            .filter((amt) => amt !== ""),
        BigInt(total),
        ],
    });
    } else {
    await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
        tokenAddress as `0x${string}`,
        // Comma or new line separated
        recipients
            .split(/[,\n]+/)
            .map((addr) => addr.trim())
            .filter((addr) => addr !== ""),
        amounts
            .split(/[,\n]+/)
            .map((amt) => amt.trim())
            .filter((amt) => amt !== ""),
        BigInt(total),
        ],
    });
    }
  }

  useEffect(() => {
    const storedTokenAddress = localStorage.getItem("tokenAddress");
    const storedRecipients = localStorage.getItem("recipients");
    const storedAmounts = localStorage.getItem("amounts");
    if (storedTokenAddress) {
      setTokenAddress(storedTokenAddress);
    }
    if (storedRecipients) {
      setRecipients(storedRecipients);
    }
    if (storedAmounts) {
      setAmounts(storedAmounts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tokenAddress", tokenAddress);
  }, [tokenAddress])

  useEffect(() => {
    localStorage.setItem("recipients", recipients);
  }, [recipients])

  useEffect(() => {
    localStorage.setItem("amounts", amounts);
  }, [amounts])

  return (
    <div className="w-lg">
      <InputField
        label="Token Address"
        placeholder="0x..."
        type="text"
        onChange={(e) => setTokenAddress(e.target.value)}
        value={tokenAddress}
      />
      <InputField
        label="Recipients"
        placeholder="0x..., 0x..."
        type="text"
        onChange={(e) => setRecipients(e.target.value)}
        value={recipients}
        large={true}
      />
      <InputField
        label="Amounts"
        placeholder="100, 200"
        type="text"
        onChange={(e) => setAmounts(e.target.value)}
        value={amounts}
        large={true}
      />

      <div className="mt-6 p-4 rounded-lg shadow-md border border-gray-200 mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-500">
          Transaction Summary
        </h3>
        {(tokenData?.[0]?.result as string) && (
          <div className="flex justify-between">
            <div>
              <strong>Token Name:</strong>
            </div>
            <div>{tokenData?.[0]?.result as string}</div>
          </div>
        )}

        <div className="mt-2">
          <div className="flex justify-between">
            <div>
              <strong>Amount (Wei):</strong>{" "}
            </div>
            <div>{total || "N/A"}</div>
          </div>
          <div className="flex justify-between">
            <div>
              <strong>Amount (Tokens):</strong>
            </div>
            <div>
              {(total / Math.pow(10, tokenData?.[1]?.result as number)).toFixed(
                6
              ) || "N/A"}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
          isPending || isConfirming ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isPending || isConfirming}
      >
        {isPending || isConfirming ? (
          <div className="flex justify-center">
            <div className="mr-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 4.627 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.514 1.826 6.533 4.553 8.341z"
                />
              </svg>
            </div>
            <div>{isPending ? "Pending..." : "Confirming..."}</div>
          </div>
        ) : (
          "Submit"
        )}
      </button>
    </div>
  );
}
