import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async (searchTerm = '') => {
        try {
            const response = await api.get(`/clients?search=${searchTerm}`);
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchClients(search);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">雇主管理</h1>
                <Link to="/clients/new" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    新增雇主
                </Link>
            </div>

            <div className="bg-white p-4 rounded shadow mb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="搜尋雇主名稱、編號或聯絡人..."
                        className="flex-1 p-2 border border-gray-300 rounded"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                        搜尋
                    </button>
                </form>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                客戶編號
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                雇主名稱
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                聯絡人
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                電話
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                產業類別
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                負責業務
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                操作
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{client.client_no}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <Link to={`/clients/${client.id}`} className="text-blue-600 hover:underline font-semibold">
                                        {client.name}
                                    </Link>
                                    <p className="text-gray-500 text-xs">{client.tax_id}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{client.contact_name}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{client.phone}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                        <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                        <span className="relative">{client.industry}</span>
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {client.Owner ? (
                                        <Link to={`/employees/${client.Owner.id}`} className="text-blue-600 hover:underline">
                                            {client.Owner.name || client.Owner.username}
                                        </Link>
                                    ) : (
                                        <span className="text-gray-900">-</span>
                                    )}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <Link to={`/clients/${client.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-3">
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

export default ClientList;
