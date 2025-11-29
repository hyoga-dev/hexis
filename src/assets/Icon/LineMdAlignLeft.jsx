import React from "react";

export function LineMdAlignLeft(props) {
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
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path strokeDasharray={14} strokeDashoffset={14} d="M4 5h13">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.2s"
            values="14;0"
          ></animate>
        </path>
        <path strokeDasharray={12} strokeDashoffset={12} d="M4 10h10">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.2s"
            dur="0.2s"
            values="12;0"
          ></animate>
        </path>
        <path strokeDasharray={20} strokeDashoffset={20} d="M4 15h16">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.4s"
            dur="0.2s"
            values="20;0"
          ></animate>
        </path>
        <path strokeDasharray={14} strokeDashoffset={14} d="M4 20h13">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.6s"
            dur="0.2s"
            values="14;0"
          ></animate>
        </path>
      </g>
    </svg>
  );
}

export default LineMdAlignLeft;
