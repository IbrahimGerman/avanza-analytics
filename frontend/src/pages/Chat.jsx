
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import api from '../services/api';
import DynamicChart from '../components/DynamicChart';
import StatCard from '../components/StatCard';

const Chat = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: 'Hello! I am your Avanza AI Assistant. You can ask me to "Show revenue trends", "Compare branch performance", or "Analyze customer distribution".',
            type: 'text'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input, type: 'text' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await api.post('/query', { query: userMsg.text });
            const { insights, charts, kpis } = response.data;

            // 1. Add Text Response (Insights)
            const botMsgText = {
                id: Date.now() + 1,
                sender: 'bot',
                text: insights,
                type: 'text'
            };

            // 2. Add KPI Cards if present
            const botMsgKPIs = kpis && kpis.length > 0 ? {
                id: Date.now() + 2,
                sender: 'bot',
                type: 'kpi_grid',
                data: kpis
            } : null;

            // 3. Add Charts if present
            const botMsgCharts = charts && charts.length > 0 ? {
                id: Date.now() + 3,
                sender: 'bot',
                type: 'chart_grid',
                data: charts
            } : null;

            setMessages(prev => {
                const newMsgs = [...prev, botMsgText];
                if (botMsgKPIs) newMsgs.push(botMsgKPIs);
                if (botMsgCharts) newMsgs.push(botMsgCharts);
                return newMsgs;
            });

        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: 'Sorry, I encountered an error processing your request.', type: 'text' }]);
        } finally {
            setLoading(false);
        }
    };

    const renderMessageContent = (msg) => {
        if (msg.type === 'text') {
            return (
                <div
                    className={`max-w-[80%] p-4 rounded-xl shadow-sm text-sm leading-relaxed ${msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                        }`}
                >
                    {msg.text}
                </div>
            );
        }

        if (msg.type === 'kpi_grid') {
            return (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                    {msg.data.map((kpi, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
                            <span className="text-gray-500 text-xs">{kpi.label}</span>
                            <span className="text-xl font-bold text-gray-800">{kpi.value}</span>
                            <span className="text-green-500 text-xs">{kpi.change}</span>
                        </div>
                    ))}
                </div>
            );
        }

        if (msg.type === 'chart_grid') {
            return (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                    {msg.data.map((chart, idx) => (
                        <div key={idx} className="h-64">
                            <DynamicChart
                                type={chart.type}
                                title={chart.title}
                                data={{
                                    labels: chart.xAxis || chart.labels,
                                    datasets: chart.datasets
                                }}
                            />
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#0B1F36] text-white p-4 flex items-center shadow-md">
                <Bot size={24} className="mr-3 text-teal-400" />
                <h2 className="font-semibold text-lg">AI Analytics Assistant</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}
                    >
                        {renderMessageContent(msg)}
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 rounded-bl-none">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center space-x-3">
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Ask a question about your data..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="bg-[#1F4FD8] text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
