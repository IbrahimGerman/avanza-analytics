import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ChartRenderer from './ChartRenderer';

const Chat = () => {
    const [messages, setMessages] = useState([
        { role: 'bot', type: 'text', content: 'Hello! I am Nexus AI. Ask me anything about your enterprise data.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', type: 'text', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post('/api/chat', { message: userMessage.content });
            const data = response.data;

            const botMessage = {
                role: 'bot',
                type: data.type || 'text',
                content: data.content, // for plain text
                data: data.data, // for analysis
                meta: data.meta // SQL, summary, etc
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', type: 'text', content: 'Sorry, I encountered an error processing your request.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-900">
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'bot' && (
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                <Bot size={16} />
                            </div>
                        )}

                        <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-slate-800 border border-slate-700 rounded-bl-none'
                            }`}>
                            {msg.type === 'text' ? (
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            ) : (
                                <div className="space-y-4">
                                    <div className="border-b border-slate-700 pb-2 mb-2">
                                        <h3 className="text-lg font-semibold text-blue-400">{msg.meta.title}</h3>
                                        <p className="text-sm text-slate-400">{msg.meta.summary}</p>
                                    </div>

                                    {/* Chart Container */}
                                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 min-h-[300px] flex items-center justify-center">
                                        <ChartRenderer type={msg.meta.chartType} data={msg.data} title={msg.meta.title} />
                                    </div>

                                    {/* SQL Toggle (Optional/Advanced) */}
                                    <div className="mt-4">
                                        <details className="text-xs text-slate-500 cursor-pointer">
                                            <summary>View SQL Query</summary>
                                            <pre className="mt-2 p-2 bg-black rounded overflow-x-auto text-green-400 font-mono">
                                                {msg.meta.sql}
                                            </pre>
                                        </details>
                                    </div>
                                </div>
                            )}
                        </div>

                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                                <User size={16} />
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center animate-pulse">
                            <Loader2 size={16} className="animate-spin" />
                        </div>
                        <div className="bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-700 flex items-center gap-2">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about sales, customers, or trends..."
                        className="w-full bg-slate-800 border-2 border-slate-700 text-white rounded-full py-4 px-6 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-lg placeholder:text-slate-500"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-2 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </form>
                <p className="text-center text-xs text-slate-600 mt-2">
                    Nexus AI can access real-time enterprise database records.
                </p>
            </div>
        </div>
    );
};

export default Chat;
