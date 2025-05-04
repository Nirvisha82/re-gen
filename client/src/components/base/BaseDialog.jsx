import React from "react";
import BaseButton from "./BaseButton";

export default function BaseDialog({ text, isOpen, toggleDialog, title }) {
  if (!isOpen) {
    return null;
  }

  const closeDialog = () => {
    toggleDialog();
  };
  return (
    <div
      onClick={closeDialog}
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
    >
      <div
        className="bg-white rounded-lg shadow-lg w-5/6 md:w-1/2 lg:w-1/3 p-4 relative z-50 h-1/4 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()} // Prevent click event from bubbling up to the parent div
      >
        {/* Dialog Header */}
        <div className="text-lg font-semibold md:text-2xl">{title}</div>

        {/* Dialog Content */}
        <div className="text-sm md:text-base">{text}</div>

        {/* Dialog CTA */}
        <div className="flex justify-end items-center">
          <BaseButton buttonText="Close" onClick={closeDialog} />
        </div>
      </div>
    </div>
  );
}
