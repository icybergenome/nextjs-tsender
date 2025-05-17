"use client";
import HomeContent from "@/components/HomeContent";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <div className="flex justify-center items-center">
      {!isConnected ? (
        <div className="font-bold text-2xl">Please connect your wallet</div>
      ) : (
        <HomeContent />
      )}
    </div>
  );
}
