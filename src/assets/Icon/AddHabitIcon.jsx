import React from "react";

export default function LineMdPlus(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeDasharray={16}
        strokeDashoffset={16}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path d="M5 12h14">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.4s"
            values="16;0"
          ></animate>
        </path>
        <path d="M12 5v14">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.4s"
            dur="0.4s"
            values="16;0"
          ></animate>
        </path>
      </g>
    </svg>
  );
}
