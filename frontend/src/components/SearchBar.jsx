import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';

const SearchBar = () => {
    const searchLoading = useDashboardStore(s => s.searchLoading);
    const searchError = useDashboardStore(s => s.searchError);
    const setInputValue = useDashboardStore(s => s.setInputValue);
    const handleSearch = useDashboardStore(s => s.handleSearch);
    const initialValue = useDashboardStore(s => s.searchInputValue);

    const [localValue, setLocalValue] = useState(initialValue || '');

    useEffect(() => {
        setLocalValue(initialValue || '');
    }, [initialValue]);

    const executeSearch = () => {
        setInputValue(localValue);
        handleSearch();
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            executeSearch();
        }
    };

    return (
        <div className="relative w-full max-w-2xl group flex flex-col items-center">
            <div className="relative w-full rounded-full shadow-[0_0_15px_rgba(227,30,36,0.2)] hover:shadow-[0_0_25px_rgba(227,30,36,0.4)] transition-all duration-300 border border-[#E31E24]/30 bg-[#002147]/95 backdrop-blur-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center cursor-pointer" onClick={executeSearch}>
                    {searchLoading ? (
                        <Loader2 className="h-5 w-5 text-[#E31E24] animate-spin" />
                    ) : (
                        <Search className="h-5 w-5 text-[#E31E24] opacity-80 hover:opacity-100 hover:scale-110 transition-all" />
                    )}
                </div>
                <input
                    type="text"
                    className={`block w-full pl-12 pr-6 py-3 bg-transparent border-none rounded-full leading-5 focus:outline-none focus:ring-0 text-white placeholder-slate-400`}
                    placeholder={searchError ? `Error: ${searchError}` : "Ask anything... e.g. 'Show team performance'"}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onKeyDown={onKeyDown}
                />
            </div>
        </div>
    );
};

export default SearchBar;
