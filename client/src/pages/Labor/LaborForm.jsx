import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';

const LaborForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        worker_no: '',
        name_en: '',
        name_zh: '',
        passport_no: '',
        entry_date: '',
        arc_no: '',
        arc_expiry_date: '',
        employment_date: '',
        client_id: '',
        maintenance_id: '',
    });

    useEffect(() => {
        fetchClients();
        fetchUsers();
        if (isEdit) {
            fetchLabor();
        }
    }, [id]);

    const fetchClients = async () => {
        try {
            const response = await api.get('/clients');
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchLabor = async () => {
        try {
            const response = await api.get(`/labors/${id}`);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching labor:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Auto-assign maintenance staff when client is selected (if not already set)
            if (name === 'client_id' && !prev.maintenance_id) {
                const client = clients.find(c => c.id === parseInt(value));
                if (client && client.owner_id) {
                    newData.maintenance_id = client.owner_id;
                }
            }
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.put(`/labors/${id}`, formData);
            } else {
                await api.post('/labors', formData);
            }
            navigate('/labors');
        } catch (error) {
            console.error('Error saving labor:', error);
            alert('儲存失敗，請檢查資料是否正確');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{isEdit ? '編輯外勞' : '新增外勞'}</h1>

            <div className="bg-white p-8 rounded shadow">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">外勞編號 *</label>
                        <input
                            type="text"
                            name="worker_no"
                            value={formData.worker_no}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">所屬雇主 *</label>
                        <select
                            name="client_id"
                            value={formData.client_id}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        >
                            <option value="">請選擇雇主</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">維護人員</label>
                        <select
                            name="maintenance_id"
                            value={formData.maintenance_id || ''}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        >
                            <option value="">請選擇維護人員</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.username}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">英文姓名 *</label>
                        <input
                            type="text"
                            name="name_en"
                            value={formData.name_en}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">中文翻譯姓名</label>
                        <input
                            type="text"
                            name="name_zh"
                            value={formData.name_zh}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">護照號碼</label>
                        <input
                            type="text"
                            name="passport_no"
                            value={formData.passport_no}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">入境日</label>
                        <input
                            type="date"
                            name="entry_date"
                            value={formData.entry_date}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">居留證號碼</label>
                        <input
                            type="text"
                            name="arc_no"
                            value={formData.arc_no}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">居留證效期</label>
                        <input
                            type="date"
                            name="arc_expiry_date"
                            value={formData.arc_expiry_date}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">任用日</label>
                        <input
                            type="date"
                            name="employment_date"
                            value={formData.employment_date}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/labors')}
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

export default LaborForm;
