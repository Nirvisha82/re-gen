"use client";

import React from "react";

export default function Activated() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center p-6">
      <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-tr from-[#5465FF] 
        to-[#2D3CC1] bg-clip-text text-transparent">
        Re:Gen
      </h1>
      <p className="mt-4 text-lg sm:text-xl font-medium text-gray-600 max-w-xl">
        Mail reply generation activated! Replies to new mails will be saved to the drafts.
      </p>
    </div>
  );
}
