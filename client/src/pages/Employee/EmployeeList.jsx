import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/users');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setError('無法載入員工資料');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('確定要刪除此員工嗎？')) {
            try {
                await api.delete(`/users/${id}`);
                fetchEmployees();
            } catch (error) {
                console.error('Error deleting employee:', error);
                alert('刪除失敗');
            }
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">員工管理</h1>
                <Link
                    to="/employees/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    新增員工
                </Link>
            </div>

            <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">員工編號</th>
                            <th className="py-3 px-6 text-left">姓名</th>
                            <th className="py-3 px-6 text-left">部門</th>
                            <th className="py-3 px-6 text-left">角色</th>
                            <th className="py-3 px-6 text-center">操作</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {employees.map((employee) => (
                            <tr key={employee.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    <span className="font-medium">
                                        {employee.employee_id || 'N/A'}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <span className="font-medium">
                                        {employee.name || '-'}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <span className="font-medium">
                                        {employee.department || '-'}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">
                                        {employee.Role?.name || '無角色'}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center">
                                        <Link to={`/employees/${employee.id}/edit`} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </Link>
                                        <button onClick={() => handleDelete(employee.id)} className="w-4 mr-2 transform hover:text-red-500 hover:scale-110">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeList;
