import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const LaborDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [labor, setLabor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        fetchLabor();
    }, [id]);

    const fetchLabor = async () => {
        try {
            const response = await api.get(`/labors/${id}`);
            setLabor(response.data);
        } catch (error) {
            console.error('Error fetching labor:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (!labor) return <div className="p-4">Labor not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">外勞詳情</h1>
                <div className="space-x-4">
                    <button
                        onClick={() => navigate('/labors')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    >
                        返回列表
                    </button>
                    <Link
                        to={`/labors/${id}/edit`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        編輯外勞
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('basic')}
                        className={`${activeTab === 'basic'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        基本資料
                    </button>
                    <button
                        onClick={() => setActiveTab('payment')}
                        className={`${activeTab === 'payment'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        應收帳款
                    </button>
                </nav>
            </div>

            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">基本資料</h3>
                    </div>
                    <div className="p-4">
                        <table className="min-w-full border-collapse border border-gray-300 text-sm">
                            <tbody>
                                <tr>
                                    <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700 w-1/6">外勞編號</th>
                                    <td className="border border-gray-300 px-4 py-2 w-1/3">{labor.worker_no}</td>
                                    <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700 w-1/6">中文姓名</th>
                                    <td className="border border-gray-300 px-4 py-2 w-1/3">{labor.name_zh}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700">英文姓名</th>
                                    <td className="border border-gray-300 px-4 py-2">{labor.name_en}</td>
                                    <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700">所屬雇主</th>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <Link to={`/clients/${labor.client_id}`} className="text-blue-600 hover:underline">
                                            {labor.Client?.name}
                                        </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700">維護人員</th>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {labor.Maintenance ? (
                                            <Link to={`/employees/${labor.Maintenance.id}`} className="text-blue-600 hover:underline">
                                                {labor.Maintenance.name || labor.Maintenance.username}
                                            </Link>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700">護照號碼</th>
                                    <td className="border border-gray-300 px-4 py-2">{labor.passport_no || '-'}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700">居留證號碼</th>
                                    <td className="border border-gray-300 px-4 py-2">{labor.arc_no || '-'}</td>
                                    <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700">居留證效期</th>
                                    <td className="border border-gray-300 px-4 py-2">{labor.arc_expiry_date || '-'}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700">入境日</th>
                                    <td className="border border-gray-300 px-4 py-2">{labor.entry_date || '-'}</td>
                                    <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700">任用日</th>
                                    <td className="border border-gray-300 px-4 py-2">{labor.employment_date || '-'}</td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700">居住住址</th>
                                    <td colSpan="3" className="border border-gray-300 px-4 py-2">{labor.residence_address || '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Payment Schedule Tab */}
            {activeTab === 'payment' && (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">移工應收帳款設定作業</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300 text-sm">
                            <thead>
                                <tr className="bg-yellow-100">
                                    <th className="border border-gray-300 px-2 py-1">期數</th>
                                    <th className="border border-gray-300 px-2 py-1">應收款日</th>
                                    <th className="border border-gray-300 px-2 py-1">服務費</th>
                                    <th className="border border-gray-300 px-2 py-1">居留證</th>
                                    <th className="border border-gray-300 px-2 py-1">體檢費</th>
                                    <th className="border border-gray-300 px-2 py-1">其他</th>
                                    <th className="border border-gray-300 px-2 py-1 bg-yellow-200">應收合計</th>
                                    <th className="border border-gray-300 px-2 py-1">實收金額</th>
                                    <th className="border border-gray-300 px-2 py-1">收款日期</th>
                                    <th className="border border-gray-300 px-2 py-1">發票編號</th>
                                    <th className="border border-gray-300 px-2 py-1">發票日期</th>
                                    <th className="border border-gray-300 px-2 py-1">備註</th>
                                </tr>
                            </thead>
                            <tbody>
                                {labor.LaborPayments && labor.LaborPayments.length > 0 ? (
                                    labor.LaborPayments.sort((a, b) => a.period - b.period).map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-2 py-1 text-center">{payment.period}</td>
                                            <td className="border border-gray-300 px-2 py-1 text-center">{payment.due_date}</td>
                                            <td className="border border-gray-300 px-2 py-1 text-right">{payment.service_fee}</td>
                                            <td className="border border-gray-300 px-2 py-1 text-right">{payment.arc_fee}</td>
                                            <td className="border border-gray-300 px-2 py-1 text-right">{payment.medical_fee}</td>
                                            <td className="border border-gray-300 px-2 py-1 text-right">{payment.other_fee}</td>
                                            <td className="border border-gray-300 px-2 py-1 text-right bg-yellow-50 font-semibold">{payment.total_amount}</td>
                                            <td className="border border-gray-300 px-2 py-1 text-right">{payment.received_amount}</td>
                                            <td className="border border-gray-300 px-2 py-1 text-center">{payment.received_date || '-'}</td>
                                            <td className="border border-gray-300 px-2 py-1 text-center">{payment.invoice_no || '-'}</td>
                                            <td className="border border-gray-300 px-2 py-1 text-center">{payment.invoice_date || '-'}</td>
                                            <td className="border border-gray-300 px-2 py-1">{payment.note || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="12" className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                                            尚無應收款資料 (請確認任用日是否已設定)
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LaborDetail;
