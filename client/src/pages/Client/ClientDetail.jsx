import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const ClientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        fetchClient();
        fetchContracts();
    }, [id]);

    const fetchClient = async () => {
        try {
            const response = await api.get(`/clients/${id}`);
            setClient(response.data);
        } catch (error) {
            console.error('Error fetching client:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchContracts = async () => {
        try {
            const response = await api.get('/contracts');
            const clientContracts = response.data.filter(c => c.client_id === parseInt(id));
            setContracts(clientContracts);
        } catch (error) {
            console.error('Error fetching contracts:', error);
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (!client) return <div className="p-4">Client not found</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">雇主詳情</h1>
                <div className="space-x-4">
                    <button
                        onClick={() => navigate('/clients')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    >
                        返回列表
                    </button>
                    <Link
                        to={`/clients/${id}/edit`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        編輯雇主
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('basic')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'basic'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        基本資訊
                    </button>
                    <button
                        onClick={() => setActiveTab('contract')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'contract'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        合約資訊 ({contracts.length})
                    </button>
                </nav>
            </div>

            {activeTab === 'basic' && (
                <>
                    {/* Client Basic Info Table */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">基本資料</h3>
                        </div>
                        <div className="p-4">
                            <table className="min-w-full border-collapse border border-gray-300">
                                <tbody>
                                    <tr>
                                        <td className="bg-gray-100 border border-gray-300 px-4 py-2 font-semibold w-1/6">客戶編號</td>
                                        <td className="border border-gray-300 px-4 py-2 w-1/3">{client.client_no}</td>
                                        <td className="bg-gray-100 border border-gray-300 px-4 py-2 font-semibold w-1/6">雇主名稱</td>
                                        <td className="border border-gray-300 px-4 py-2 w-1/3">{client.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="bg-gray-100 border border-gray-300 px-4 py-2 font-semibold">統一編號</td>
                                        <td className="border border-gray-300 px-4 py-2">{client.tax_id || '-'}</td>
                                        <td className="bg-gray-100 border border-gray-300 px-4 py-2 font-semibold">產業類別</td>
                                        <td className="border border-gray-300 px-4 py-2">{client.industry || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="bg-gray-100 border border-gray-300 px-4 py-2 font-semibold">聯絡人</td>
                                        <td className="border border-gray-300 px-4 py-2">{client.contact_name || '-'}</td>
                                        <td className="bg-gray-100 border border-gray-300 px-4 py-2 font-semibold">聯絡電話</td>
                                        <td className="border border-gray-300 px-4 py-2">{client.phone || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="bg-gray-100 border border-gray-300 px-4 py-2 font-semibold">部門代號</td>
                                        <td className="border border-gray-300 px-4 py-2">{client.dept_code || '-'}</td>
                                        <td className="bg-gray-100 border border-gray-300 px-4 py-2 font-semibold">負責業務</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {client.Owner ? (
                                                <Link to={`/employees/${client.Owner.id}`} className="text-blue-600 hover:underline">
                                                    {client.Owner.name || client.Owner.username}
                                                </Link>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bg-gray-100 border border-gray-300 px-4 py-2 font-semibold">聯絡地址</td>
                                        <td colSpan="3" className="border border-gray-300 px-4 py-2">{client.address || '-'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Associated Labors List */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">所屬外勞列表</h3>
                        </div>
                        <div className="p-4">
                            {client.Labors && client.Labors.length > 0 ? (
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                外勞代號
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                中文姓名
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                入境日
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                居留證號
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {client.Labors.map((labor) => (
                                            <tr key={labor.id}>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{labor.worker_no}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <Link to={`/labors/${labor.id}`} className="text-blue-600 hover:underline font-semibold">
                                                        {labor.name_zh}
                                                    </Link>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">
                                                        {labor.entry_date ? new Date(labor.entry_date).toLocaleDateString() : '-'}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{labor.arc_no || '-'}</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-500 text-center py-4">目前無所屬外勞資料</p>
                            )}
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'contract' && (
                <div className="bg-white shadow-md rounded p-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">合約資訊</h2>
                    {contracts.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">目前沒有合約記錄</p>
                    ) : (
                        <div className="space-y-4">
                            {contracts.map((contract) => (
                                <div key={contract.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{contract.original_name}</h3>
                                            {contract.contract_number && (
                                                <p className="text-sm text-gray-600 mt-1">合約編號: {contract.contract_number}</p>
                                            )}
                                            <p className="text-sm text-gray-500 mt-1">
                                                上傳時間: {new Date(contract.upload_date).toLocaleDateString('zh-TW')}
                                            </p>
                                        </div>
                                        <Link
                                            to="/documentation"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                                        >
                                            查看合約
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ClientDetail;
