import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';

const LaborList = () => {
    const [labors, setLabors] = useState([]);
    const [search, setSearch] = useState('');
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');

    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLabors();
        fetchClients();
    }, []);

    const fetchLabors = async (searchTerm = '', clientId = '') => {
        try {
            setError(null);
            let url = `/labors?search=${searchTerm}`;
            if (clientId) url += `&client_id=${clientId}`;
            const response = await api.get(url);
            setLabors(response.data);
        } catch (error) {
            console.error('Error fetching labors:', error);
            setError('無法取得外勞資料，請稍後再試或重新登入。');
        }
    };

    const fetchClients = async () => {
        try {
            const response = await api.get('/clients');
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchLabors(search, selectedClient);
    };

    const handleClientFilter = (e) => {
        const clientId = e.target.value;
        setSelectedClient(clientId);
        fetchLabors(search, clientId);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">外勞管理</h1>
                <Link to="/labors/new" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    新增外勞
                </Link>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">錯誤！</strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="bg-white p-4 rounded shadow mb-6">
                <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
                    <input
                        type="text"
                        placeholder="搜尋姓名、護照、居留證..."
                        className="flex-1 p-2 border border-gray-300 rounded min-w-[200px]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        value={selectedClient}
                        onChange={handleClientFilter}
                        className="p-2 border border-gray-300 rounded min-w-[200px]"
                    >
                        <option value="">所有雇主</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>

                    <button type="submit" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                        搜尋
                    </button>
                </form>
            </div>

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                外勞編號
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                姓名 (中/英)
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                所屬雇主
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                維護人員
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                居留證號
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                居留證效期
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                操作
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {labors.map((labor) => (
                            <tr key={labor.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{labor.worker_no}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <Link to={`/labors/${labor.id}`} className="text-blue-600 hover:underline font-semibold">
                                        {labor.name_zh}
                                    </Link>
                                    <p className="text-gray-500 text-xs">{labor.name_en}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <Link to={`/clients/${labor.client_id}`} className="text-blue-600 hover:underline">
                                        {labor.Client?.name}
                                    </Link>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {labor.Maintenance ? (
                                        <Link to={`/employees/${labor.Maintenance.id}`} className="text-blue-600 hover:underline">
                                            {labor.Maintenance.name || labor.Maintenance.username}
                                        </Link>
                                    ) : (
                                        <span className="text-gray-900">-</span>
                                    )}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{labor.arc_no}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{labor.arc_expiry_date}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <Link to={`/labors/${labor.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-3">
                                        編輯
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LaborList;
