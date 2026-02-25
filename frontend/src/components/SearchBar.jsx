
import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

const SearchBar = ({ placeholder = "Search analytics e.g. 'Show Q1 2023 sales'..." }) => {
    const [query, setQuery] = useState('');

    return (
        <div className="relative w-full max-w-2xl group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-text-secondary group-focus-within:text-primary transition-colors" />
            </div>
            <input
                type="text"
                className="block w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-full leading-5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md glass-morphism text-black bg-white placeholder-slate-400"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Sparkles className="h-5 w-5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    );
};

export default SearchBar;
