import React from "react";

export function LineMdAlignJustify(props) {
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
                strokeDasharray={8}
                strokeDashoffset={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
            >
                <path d="M12 5h6M12 5h-6">
                    <animate
                        fill="freeze"
                        attributeName="stroke-dashoffset"
                        dur="0.2s"
                        values="8;0"
                    ></animate>
                </path>
                <path d="M12 10h6M12 10h-6">
                    <animate
                        fill="freeze"
                        attributeName="stroke-dashoffset"
                        begin="0.2s"
                        dur="0.2s"
                        values="8;0"
                    ></animate>
                </path>
                <path d="M12 15h6M12 15h-6">
                    <animate
                        fill="freeze"
                        attributeName="stroke-dashoffset"
                        begin="0.4s"
                        dur="0.2s"
                        values="8;0"
                    ></animate>
                </path>

            </g>
        </svg>
    );
}
