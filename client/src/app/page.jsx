"use client";
import React from "react";

export default function Home() {
  const activate = () => {
    window.location.href = "http://localhost:8080/gmail/auth/url";
  };
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        onClick={activate}
        style={{ padding: "1rem 2rem", fontSize: "1.2rem" }}
      >
        Activate Automated Email Replies
      </button>
    </div>
  );
}
