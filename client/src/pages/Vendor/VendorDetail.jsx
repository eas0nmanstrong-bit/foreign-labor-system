import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api';

const VendorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState(null);
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('basic');

    const categories = {
        broker: '仲介公司', training: '訓練機構', medical: '醫療機構',
        insurance: '保險公司', translation: '翻譯服務', legal: '法律諮詢',
        accommodation: '住宿服務', other: '其他'
    };

    useEffect(() => {
        fetchVendor();
        fetchContracts();
    }, [id]);

    const fetchVendor = async () => {
        try {
            const response = await api.get(`/vendors/${id}`);
            setVendor(response.data);
        } catch (error) {
            console.error('Error fetching vendor:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchContracts = async () => {
        try {
            const response = await api.get('/contracts');
            const vendorContracts = response.data.filter(c => c.vendor_id === parseInt(id));
            setContracts(vendorContracts);
        } catch (error) {
            console.error('Error fetching contracts:', error);
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (!vendor) return <div className="p-4">廠商不存在</div>;

    const serviceItems = vendor.service_items ? JSON.parse(vendor.service_items) : [];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">廠商詳情</h1>
                <div className="space-x-2">
                    <button
                        onClick={() => navigate('/vendors')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    >
                        返回列表
                    </button>
                    <Link
                        to={`/vendors/${id}/edit`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
                    >
                        編輯廠商
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
                <div className="bg-white shadow-md rounded p-6 space-y-6">
                    {/* 基本資訊 */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">基本資訊</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div><span className="font-semibold">廠商編號:</span> {vendor.vendor_no}</div>
                            <div><span className="font-semibold">廠商名稱:</span> {vendor.name}</div>
                            <div><span className="font-semibold">英文名稱:</span> {vendor.name_en || '-'}</div>
                            <div><span className="font-semibold">類別:</span> {categories[vendor.category]}</div>
                            <div><span className="font-semibold">統一編號:</span> {vendor.tax_id || '-'}</div>
                            <div><span className="font-semibold">狀態:</span>
                                <span className={`ml-2 py-1 px-3 rounded-full text-xs ${vendor.status === 'active' ? 'bg-green-200 text-green-600' :
                                        vendor.status === 'inactive' ? 'bg-gray-200 text-gray-600' :
                                            'bg-red-200 text-red-600'
                                    }`}>
                                    {vendor.status === 'active' ? '營業中' :
                                        vendor.status === 'inactive' ? '已停用' : '暫停合作'}
                                </span>
                            </div>
                            <div><span className="font-semibold">評價:</span> {'⭐'.repeat(vendor.rating || 0)}</div>
                        </div>
                    </div>

                    {/* 聯絡資訊 */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">聯絡資訊</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div><span className="font-semibold">聯絡人:</span> {vendor.contact_person || '-'}</div>
                            <div><span className="font-semibold">職稱:</span> {vendor.contact_title || '-'}</div>
                            <div><span className="font-semibold">電話:</span> {vendor.phone || '-'}</div>
                            <div><span className="font-semibold">手機:</span> {vendor.mobile || '-'}</div>
                            <div><span className="font-semibold">傳真:</span> {vendor.fax || '-'}</div>
                            <div><span className="font-semibold">Email:</span> {vendor.email || '-'}</div>
                            <div className="col-span-2"><span className="font-semibold">網站:</span> {vendor.website || '-'}</div>
                        </div>
                    </div>

                    {/* 地址資訊 */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">地址資訊</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2"><span className="font-semibold">地址:</span> {vendor.address || '-'}</div>
                            <div><span className="font-semibold">城市:</span> {vendor.city || '-'}</div>
                            <div><span className="font-semibold">國家:</span> {vendor.country || '-'}</div>
                        </div>
                    </div>

                    {/* 銀行資訊 */}
                    {(vendor.bank_name || vendor.bank_account) && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">銀行資訊</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div><span className="font-semibold">銀行名稱:</span> {vendor.bank_name || '-'}</div>
                                <div><span className="font-semibold">分行:</span> {vendor.bank_branch || '-'}</div>
                                <div className="col-span-2"><span className="font-semibold">銀行帳號:</span> {vendor.bank_account || '-'}</div>
                            </div>
                        </div>
                    )}

                    {/* 業務資訊 */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">業務資訊</h2>
                        <div className="space-y-2">
                            <div>
                                <span className="font-semibold">服務項目:</span>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {serviceItems.map((item, index) => (
                                        <span key={index} className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div><span className="font-semibold">負責業務員:</span> {vendor.Owner?.name || vendor.Owner?.username || '-'}</div>
                            {vendor.notes && (
                                <div>
                                    <span className="font-semibold">備註:</span>
                                    <p className="mt-2 text-gray-600 whitespace-pre-wrap">{vendor.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
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

export default VendorDetail;
