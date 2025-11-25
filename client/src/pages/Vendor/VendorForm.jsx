import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

const VendorForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        vendor_no: '',
        name: '',
        name_en: '',
        category: '',
        tax_id: '',
        contact_person: '',
        contact_title: '',
        phone: '',
        mobile: '',
        fax: '',
        email: '',
        website: '',
        address: '',
        city: '',
        country: '台灣',
        bank_name: '',
        bank_account: '',
        bank_branch: '',
        service_items: '',
        rating: 0,
        status: 'active',
        notes: ''
    });

    const categories = {
        broker: '仲介公司', training: '訓練機構', medical: '醫療機構',
        insurance: '保險公司', translation: '翻譯服務', legal: '法律諮詢',
        accommodation: '住宿服務', other: '其他'
    };

    useEffect(() => {
        if (isEdit) {
            fetchVendor();
        }
    }, [id]);

    const fetchVendor = async () => {
        try {
            const response = await api.get(`/vendors/${id}`);
            const vendor = response.data;
            setFormData({
                ...vendor,
                service_items: vendor.service_items ? JSON.parse(vendor.service_items).join(', ') : ''
            });
        } catch (error) {
            console.error('Error fetching vendor:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const submitData = {
                ...formData,
                service_items: formData.service_items
                    ? JSON.stringify(formData.service_items.split(',').map(s => s.trim()).filter(s => s))
                    : '[]'
            };

            if (isEdit) {
                await api.put(`/vendors/${id}`, submitData);
            } else {
                await api.post('/vendors', submitData);
            }
            navigate('/vendors');
        } catch (error) {
            console.error('Error saving vendor:', error);
            alert('儲存失敗：' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {isEdit ? '編輯廠商' : '新增廠商'}
            </h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {/* 基本資訊 */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">基本資訊</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">廠商編號 *</label>
                            <input
                                type="text"
                                name="vendor_no"
                                value={formData.vendor_no}
                                onChange={handleChange}
                                required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">廠商類別 *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            >
                                <option value="">請選擇</option>
                                {Object.entries(categories).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">廠商名稱 *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">英文名稱</label>
                            <input
                                type="text"
                                name="name_en"
                                value={formData.name_en}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">統一編號</label>
                            <input
                                type="text"
                                name="tax_id"
                                value={formData.tax_id}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">狀態</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            >
                                <option value="active">營業中</option>
                                <option value="inactive">已停用</option>
                                <option value="suspended">暫停合作</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">評價 (1-5星)</label>
                            <select
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            >
                                {[0, 1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num} {'⭐'.repeat(num)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 聯絡資訊 */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">聯絡資訊</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">聯絡人</label>
                            <input type="text" name="contact_person" value={formData.contact_person} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">職稱</label>
                            <input type="text" name="contact_title" value={formData.contact_title} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">電話</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">手機</label>
                            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">傳真</label>
                            <input type="text" name="fax" value={formData.fax} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">網站</label>
                            <input type="text" name="website" value={formData.website} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                        </div>
                    </div>
                </div>

                {/* 地址資訊 */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">地址資訊</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">地址</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">城市</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">國家</label>
                            <input type="text" name="country" value={formData.country} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                        </div>
                    </div>
                </div>

                {/* 銀行資訊 */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">銀行資訊</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">銀行名稱</label>
                            <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">分行</label>
                            <input type="text" name="bank_branch" value={formData.bank_branch} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">銀行帳號</label>
                            <input type="text" name="bank_account" value={formData.bank_account} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                        </div>
                    </div>
                </div>

                {/* 業務資訊 */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">業務資訊</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">服務項目 (逗號分隔)</label>
                            <input
                                type="text"
                                name="service_items"
                                value={formData.service_items}
                                onChange={handleChange}
                                placeholder="例如: 外勞仲介, 文件代辦, 翻譯服務"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">備註</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="4"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                    </div>
                </div>

                {/* 按鈕 */}
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate('/vendors')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        取消
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {isEdit ? '更新' : '新增'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VendorForm;
