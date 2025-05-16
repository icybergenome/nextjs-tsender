import { FaGithub } from "react-icons/fa";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      <div className="text-xl font-bold text-blue-600 flex items-center gap-4">
        <a
          href="https://github.com/icybergenome/nextjs-viem-tsender"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 transition-colors duration-200 text-gray-900"
        >
          <FaGithub size={24} />
        </a>
        <h1 className="text-2xl font-bold text-gray-800">TSender</h1>
      </div>
      <div className="space-x-4">
        <ConnectButton />
      </div>
    </header>
  );
}
