"use client";

import React from "react";

export default function Home() {
  const activate = () => {
    window.location.href = "http://localhost:8080/gmail/auth/url";
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-50 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-tr from-[#5465FF] 
                 to-[#2D3CC1] bg-clip-text text-transparent">
  Re:Gen
</h1>
      <p className="mt-4 text-lg sm:text-xl font-medium text-gray-600 max-w-xl">
      AI‑generated smart replies, auto‑saved to drafts so you can respond instantly.
      </p>
      <button
        onClick={activate}
        className="mt-8 bg-[#5465FF] hover:bg-[#2D3CC1] text-white font-semibold py-4 px-8 rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Activate Reply Generation
      </button>
    </div>
  );
}
