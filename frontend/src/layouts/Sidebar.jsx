
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart2, MessageSquare, Settings, LogOut, Activity } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'Executive Overview', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Branch Performance', path: '/branch', icon: <BarChart2 size={20} /> },
        { name: 'Operational Analytics', path: '/operational', icon: <Activity size={20} /> },
        { name: 'AI Assistant', path: '/chat', icon: <MessageSquare size={20} /> },
    ];

    return (
        <div className="h-screen w-64 bg-[#0B1F36] text-white flex flex-col fixed left-0 top-0 shadow-lg z-50">
            <div className="p-6 border-b border-gray-700">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                    Avanza AI
                </h1>
                <p className="text-xs text-gray-400 mt-1">Enterprise Analytics</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-[#1F4FD8] text-white shadow-md shadow-blue-900/50'
                                : 'text-gray-400 hover:bg-[#1F2937] hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-700">
                <button className="flex items-center space-x-3 text-gray-400 hover:text-white w-full px-4 py-2 transition-colors">
                    <Settings size={18} />
                    <span>Settings</span>
                </button>
                <button className="flex items-center space-x-3 text-gray-400 hover:text-red-400 w-full px-4 py-2 mt-2 transition-colors">
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
