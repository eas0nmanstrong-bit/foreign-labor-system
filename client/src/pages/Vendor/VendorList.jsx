import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const VendorList = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        status: '',
        search: ''
    });

    const categories = {
        broker: '仲介公司',
        training: '訓練機構',
        medical: '醫療機構',
        insurance: '保險公司',
        translation: '翻譯服務',
        legal: '法律諮詢',
        accommodation: '住宿服務',
        other: '其他'
    };

    const categoryColors = {
        broker: 'bg-blue-100 text-blue-800',
        training: 'bg-green-100 text-green-800',
        medical: 'bg-red-100 text-red-800',
        insurance: 'bg-purple-100 text-purple-800',
        translation: 'bg-yellow-100 text-yellow-800',
        legal: 'bg-gray-100 text-gray-800',
        accommodation: 'bg-pink-100 text-pink-800',
        other: 'bg-orange-100 text-orange-800'
    };

    useEffect(() => {
        fetchVendors();
    }, [filters]);

    const fetchVendors = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.category) params.append('category', filters.category);
            if (filters.status) params.append('status', filters.status);
            if (filters.search) params.append('search', filters.search);

            const response = await api.get(`/vendors?${params.toString()}`);
            setVendors(response.data.vendors || response.data);
        } catch (error) {
            console.error('Error fetching vendors:', error);
            setError('無法載入廠商資料');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('確定要刪除此廠商嗎？')) {
            try {
                await api.delete(`/vendors/${id}`);
                fetchVendors();
            } catch (error) {
                console.error('Error deleting vendor:', error);
                alert('刪除失敗');
            }
        }
    };

    const renderRating = (rating) => {
        return '⭐'.repeat(rating || 0);
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">廠商管理</h1>
                <Link
                    to="/vendors/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    新增廠商
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white shadow-md rounded p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">類別</label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                            <option value="">全部類別</option>
                            {Object.entries(categories).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">狀態</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                            <option value="">全部狀態</option>
                            <option value="active">營業中</option>
                            <option value="inactive">已停用</option>
                            <option value="suspended">暫停合作</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">搜尋</label>
                        <input
                            type="text"
                            placeholder="廠商名稱、編號..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>
                </div>
            </div>

            {/* Vendor Table */}
            <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">廠商編號</th>
                            <th className="py-3 px-6 text-left">廠商名稱</th>
                            <th className="py-3 px-6 text-left">類別</th>
                            <th className="py-3 px-6 text-left">聯絡人</th>
                            <th className="py-3 px-6 text-left">電話</th>
                            <th className="py-3 px-6 text-left">狀態</th>
                            <th className="py-3 px-6 text-left">評價</th>
                            <th className="py-3 px-6 text-center">操作</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {vendors.map((vendor) => (
                            <tr key={vendor.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    <span className="font-medium">{vendor.vendor_no}</span>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <Link to={`/vendors/${vendor.id}`} className="font-medium text-blue-600 hover:underline">
                                        {vendor.name}
                                    </Link>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <span className={`py-1 px-3 rounded-full text-xs ${categoryColors[vendor.category]}`}>
                                        {categories[vendor.category]}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-left">{vendor.contact_person || '-'}</td>
                                <td className="py-3 px-6 text-left">{vendor.phone || '-'}</td>
                                <td className="py-3 px-6 text-left">
                                    <span className={`py-1 px-3 rounded-full text-xs ${vendor.status === 'active' ? 'bg-green-200 text-green-600' :
                                            vendor.status === 'inactive' ? 'bg-gray-200 text-gray-600' :
                                                'bg-red-200 text-red-600'
                                        }`}>
                                        {vendor.status === 'active' ? '營業中' :
                                            vendor.status === 'inactive' ? '已停用' : '暫停合作'}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-left">{renderRating(vendor.rating)}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center">
                                        <Link to={`/vendors/${vendor.id}/edit`} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </Link>
                                        <button onClick={() => handleDelete(vendor.id)} className="w-4 mr-2 transform hover:text-red-500 hover:scale-110">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {vendors.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        沒有找到廠商資料
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorList;
