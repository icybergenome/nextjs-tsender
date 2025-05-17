"use client";

import InputField from "@/components/ui/InputField";
import { useMemo, useState } from "react";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi";
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

  return (
    <div>
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
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>
    </div>
  );
}
