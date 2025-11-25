import React, { useState } from 'react';

const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const announcements = [
        {
            id: 1,
            title: '系統維護通知',
            date: '2025-11-24',
            category: '系統公告',
            content: '本系統將於本週六 (11/29) 凌晨 02:00 - 04:00 進行例行性伺服器維護，屆時將無法登入系統，造成不便敬請見諒。',
            author: '系統管理員',
            priority: 'high'
        },
        {
            id: 2,
            title: '2025年度員工健康檢查公告',
            date: '2025-11-20',
            category: '人資公告',
            content: '2025年度員工健康檢查將於 12 月開始報名，請各位同仁留意信箱通知，並於期限內完成線上預約。',
            author: '人資部',
            priority: 'normal'
        },
        {
            id: 3,
            title: '年終尾牙活動調查',
            date: '2025-11-15',
            category: '活動通知',
            content: '今年的尾牙將於 1/15 舉行，請大家填寫出席意願調查表，並投票選出最想抽到的獎品！',
            author: '福委會',
            priority: 'normal'
        },
        {
            id: 4,
            title: '資安宣導：請定期更換密碼',
            date: '2025-11-10',
            category: '資安公告',
            content: '為確保資訊安全，請同仁每三個月更換一次系統登入密碼，並避免使用容易被猜測的組合。',
            author: '資訊部',
            priority: 'high'
        },
        {
            id: 5,
            title: '新版外勞管理法規教育訓練',
            date: '2025-11-05',
            category: '教育訓練',
            content: '針對最新修訂的外勞管理法規，公司將舉辦內部教育訓練，請業務部與維護部同仁務必參加。',
            author: '法務部',
            priority: 'high'
        }
    ];

    const categories = ['All', '系統公告', '人資公告', '活動通知', '資安公告', '教育訓練'];

    const filteredAnnouncements = announcements.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const getPriorityColor = (priority) => {
        return priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">公司公告欄</h1>
                <div className="text-sm text-gray-500">
                    今天是 {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="搜尋公告關鍵字..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${categoryFilter === cat
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                {filteredAnnouncements.length > 0 ? (
                    filteredAnnouncements.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden border-l-4 border-blue-500">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                            {item.priority === 'high' ? '重要' : '一般'}
                                        </span>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                            {item.category}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                                    </div>
                                    <span className="text-sm text-gray-500 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {item.date}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4 leading-relaxed">
                                    {item.content}
                                </p>
                                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="font-medium text-gray-700 mr-2">發布者:</span>
                                        {item.author}
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                                        閱讀更多
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">找不到相關公告</h3>
                        <p className="text-gray-500 mt-1">請嘗試使用其他關鍵字搜尋</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
