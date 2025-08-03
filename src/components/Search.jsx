'use client';

import { useState } from 'react';

export default function SearchInput({ placeholder = "Search...", onSearch }) {
    const [query, setQuery] = useState("");

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        if (onSearch) {
            onSearch(e.target.value);
        }
    };

    return (
        <div className="pb-8 w-full">
            <div className="relative w-full">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent search-input"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                        <path d="M9.583 17.5c4.372 0 7.917-3.544 7.917-7.917S13.955 1.667 9.583 1.667 1.667 5.211 1.667 9.583 5.211 17.5 9.583 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18.333 18.333 16.667 16.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
