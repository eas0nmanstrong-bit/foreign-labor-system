import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';

const EmployeeForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role_id: '2' // Default to Staff (ID 2)
    });
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch roles (hardcoded for now as we don't have a roles API yet, or fetch if available)
        // For simplicity, we'll assume 1=Admin, 2=Staff
        setRoles([
            { id: 1, name: 'Admin' },
            { id: 2, name: 'Staff' }
        ]);

        if (isEditMode) {
            fetchEmployee();
        }
    }, [id]);

    const fetchEmployee = async () => {
        try {
            const response = await api.get(`/users/${id}`);
            setFormData({
                username: response.data.username,
                password: '', // Don't show password
                role_id: response.data.role_id
            });
        } catch (error) {
            console.error('Error fetching employee:', error);
            setError('無法載入員工資料');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditMode) {
                // Update user (role only)
                await api.put(`/users/${id}`, { role_id: formData.role_id });

                // If password is provided, update it separately
                if (formData.password) {
                    await api.put(`/users/${id}/password`, { password: formData.password });
                }
            } else {
                // Create user
                await api.post('/users', formData);
            }
            navigate('/employees');
        } catch (error) {
            console.error('Error saving employee:', error);
            setError(error.response?.data?.message || '儲存失敗');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditMode ? '編輯員工' : '新增員工'}</h2>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        帳號 (Username)
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isEditMode} // Cannot change username
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isEditMode ? 'bg-gray-100' : ''}`}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        密碼 {isEditMode && '(若不修改請留空)'}
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required={!isEditMode}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role_id">
                        角色
                    </label>
                    <select
                        id="role_id"
                        name="role_id"
                        value={formData.role_id}
                        onChange={handleChange}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? '儲存中...' : '儲存'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/employees')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        取消
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeForm;
