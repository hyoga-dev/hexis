import React from "react";

export default function LineMdLogOut(props) {
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
                <path
                    strokeDasharray={48}
                    strokeDashoffset={48}
                    d="M16 5v-1c0 -0.55 -0.45 -1 -1 -1h-9c-0.55 0 -1 0.45 -1 1v16c0 0.55 0.45 1 1 1h9c0.55 0 1 -0.45 1 -1v-1"
                >
                    <animate
                        fill="freeze"
                        attributeName="stroke-dashoffset"
                        dur="0.6s"
                        values="48;0"
                    ></animate>
                </path>
                <path strokeDasharray={12} strokeDashoffset={12} d="M10 12h11">
                    <animate
                        fill="freeze"
                        attributeName="stroke-dashoffset"
                        begin="0.7s"
                        dur="0.2s"
                        values="12;0"
                    ></animate>
                </path>
                <path
                    strokeDasharray={6}
                    strokeDashoffset={6}
                    d="M21 12l-3.5 -3.5M21 12l-3.5 3.5"
                >
                    <animate
                        fill="freeze"
                        attributeName="stroke-dashoffset"
                        begin="0.9s"
                        dur="0.2s"
                        values="6;0"
                    ></animate>
                </path>
            </g>
        </svg>
    );
}
