import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';

const ClientForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        client_no: '',
        name: '',
        tax_id: '',
        contact_name: '',
        phone: '',
        address: '',
        industry: '',
        dept_code: '',
    });

    useEffect(() => {
        if (isEdit) {
            fetchClient();
        }
    }, [id]);

    const fetchClient = async () => {
        try {
            const response = await api.get(`/clients/${id}`);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching client:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.put(`/clients/${id}`, formData);
            } else {
                await api.post('/clients', formData);
            }
            navigate('/clients');
        } catch (error) {
            console.error('Error saving client:', error);
            alert('儲存失敗，請檢查資料是否正確 (例如編號重複)');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{isEdit ? '編輯雇主' : '新增雇主'}</h1>

            <div className="bg-white p-8 rounded shadow">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">客戶編號 *</label>
                        <input
                            type="text"
                            name="client_no"
                            value={formData.client_no}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">雇主名稱 *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">統一編號 / 身分證</label>
                        <input
                            type="text"
                            name="tax_id"
                            value={formData.tax_id}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">部門代號</label>
                        <input
                            type="text"
                            name="dept_code"
                            value={formData.dept_code}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">聯絡人</label>
                        <input
                            type="text"
                            name="contact_name"
                            value={formData.contact_name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">聯絡電話</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">產業類別</label>
                        <select
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        >
                            <option value="">請選擇</option>
                            <option value="製造業">製造業</option>
                            <option value="營造業">營造業</option>
                            <option value="家庭看護">家庭看護</option>
                            <option value="機構看護">機構看護</option>
                            <option value="其他">其他</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">聯絡地址</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/clients')}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                        >
                            儲存
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ClientForm;
