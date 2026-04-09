"use client";

import { useRouter } from "next/navigation";

export default function Button() {
    const navigate = useRouter();
    return (
        <div className="flex justify-center">
            <button
                onClick={() => navigate.push("/category")}
                className="bg-[#16A34A] text-white py-2.5 px-6 rounded-xl font-medium text-sm flex items-center justify-center hover:bg-[#15803d] transition-colors duration-200 cursor-pointer"
            >
                View More
            </button>
        </div>
    );
}
