import React from "react";

export default function LineMdPersonFilled(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            {...props}
        >
            <g
                fill="currentColor"
                fillOpacity={0}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
            >
                <path
                    strokeDasharray={20}
                    strokeDashoffset={20}
                    d="M12 5c1.66 0 3 1.34 3 3c0 1.66 -1.34 3 -3 3c-1.66 0 -3 -1.34 -3 -3c0 -1.66 1.34 -3 3 -3Z"
                >
                    <animate
                        fill="freeze"
                        attributeName="stroke-dashoffset"
                        dur="0.4s"
                        values="20;0"
                    ></animate>
                </path>
                <path
                    strokeDasharray={36}
                    strokeDashoffset={36}
                    d="M12 14c4 0 7 2 7 3v2h-14v-2c0 -1 3 -3 7 -3Z"
                >
                    <animate
                        fill="freeze"
                        attributeName="stroke-dashoffset"
                        begin="0.5s"
                        dur="0.5s"
                        values="36;0"
                    ></animate>
                </path>
                <animate
                    fill="freeze"
                    attributeName="fill-opacity"
                    begin="1.1s"
                    dur="0.5s"
                    values="0;1"
                ></animate>
            </g>
        </svg>
    );
}
