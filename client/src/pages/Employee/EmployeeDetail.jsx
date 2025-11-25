import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const EmployeeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchEmployee(id);
        }
    }, [id]);

    const fetchEmployee = async (employeeId) => {
        try {
            const response = await api.get(`/users/${employeeId}`);
            setEmployee(response.data);
        } catch (error) {
            console.error('Error fetching employee:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (!employee) return <div className="p-4">Employee not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">員工詳情</h1>
                <div className="space-x-4">
                    <button
                        onClick={() => navigate('/employees')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    >
                        返回列表
                    </button>
                    <Link
                        to={`/employees/${id}/edit`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        編輯員工
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">基本資料</h3>
                </div>
                <div className="p-4">
                    <table className="min-w-full border-collapse border border-gray-300 text-sm">
                        <tbody>
                            <tr>
                                <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700 w-1/6">帳號</th>
                                <td className="border border-gray-300 px-4 py-2 w-1/3">{employee.username}</td>
                                <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700 w-1/6">角色</th>
                                <td className="border border-gray-300 px-4 py-2 w-1/3">
                                    <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">
                                        {employee.Role?.name || '無角色'}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700">電子郵件</th>
                                <td className="border border-gray-300 px-4 py-2">{employee.email || '-'}</td>
                                <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700">電話</th>
                                <td className="border border-gray-300 px-4 py-2">{employee.phone || '-'}</td>
                            </tr>
                            <tr>
                                <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700">部門</th>
                                <td className="border border-gray-300 px-4 py-2">{employee.department || '-'}</td>
                                <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700">職位</th>
                                <td className="border border-gray-300 px-4 py-2">{employee.position || '-'}</td>
                            </tr>
                            <tr>
                                <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-gray-700">到職日期</th>
                                <td colSpan="3" className="border border-gray-300 px-4 py-2">{employee.hire_date || '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetail;
