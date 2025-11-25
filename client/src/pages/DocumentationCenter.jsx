import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, Download, Trash2, Filter } from 'lucide-react';
import api from '../api';

const DocumentationCenter = () => {
    const [contracts, setContracts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [uploading, setUploading] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        file: null,
        category: '勞動合約',
        description: ''
    });

    const categories = [
        '勞動合約',
        '雇主合約',
        '供應商合約',
        '內部文件',
        '其他'
    ];

    useEffect(() => {
        fetchContracts();
    }, [selectedCategory]);

    const fetchContracts = async () => {
        try {
            const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
            const response = await api.get('/contracts', { params });
            setContracts(response.data);
        } catch (error) {
            console.error('Failed to fetch contracts:', error);
            alert('載入合約失敗');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert('檔案大小不能超過 10MB');
                e.target.value = '';
                return;
            }
            setUploadForm({ ...uploadForm, file });
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!uploadForm.file) {
            alert('請選擇檔案');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', uploadForm.file);
        formData.append('category', uploadForm.category);
        formData.append('description', uploadForm.description);

        try {
            await api.post('/contracts/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('上傳成功！');
            setUploadForm({ file: null, category: '勞動合約', description: '' });
            document.getElementById('fileInput').value = '';
            fetchContracts();
        } catch (error) {
            console.error('Upload failed:', error);
            alert(error.response?.data?.message || '上傳失敗');
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (contractId, filename) => {
        try {
            const response = await api.get(`/contracts/${contractId}/download`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Download failed:', error);
            alert('下載失敗');
        }
    };

    const handleDelete = async (contractId) => {
        if (!window.confirm('確定要刪除此合約嗎？')) {
            return;
        }

        try {
            await api.delete(`/contracts/${contractId}`);
            alert('刪除成功');
            fetchContracts();
        } catch (error) {
            console.error('Delete failed:', error);
            alert(error.response?.data?.message || '刪除失敗');
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderRelatedEntity = (contract) => {
        if (contract.Labor) {
            return (
                <Link to={`/labors/${contract.Labor.id}`} className="text-blue-600 hover:underline">
                    {contract.Labor.name_zh || contract.Labor.name_en}
                </Link>
            );
        }
        if (contract.Vendor) {
            return (
                <Link to={`/vendors/${contract.Vendor.id}`} className="text-blue-600 hover:underline">
                    {contract.Vendor.name}
                </Link>
            );
        }
        if (contract.Client) {
            return (
                <Link to={`/clients/${contract.Client.id}`} className="text-blue-600 hover:underline">
                    {contract.Client.name}
                </Link>
            );
        }
        return '-';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FileText size={32} className="text-blue-600" />
                        文檔中心 - 合約管理
                    </h1>
                    <p className="text-gray-600 mt-2">上傳、管理和下載公司合約文件</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Upload size={20} />
                        上傳新合約
                    </h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">選擇檔案 *</label>
                                <input
                                    id="fileInput"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">支援 PDF、Word、Excel 格式，最大 10MB</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">合約類別 *</label>
                                <select
                                    value={uploadForm.category}
                                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">備註說明</label>
                            <textarea
                                value={uploadForm.description}
                                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="2"
                                placeholder="選填：合約相關說明..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Upload size={18} />
                            {uploading ? '上傳中...' : '上傳合約'}
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Filter size={20} className="text-gray-600" />
                        <span className="font-medium">篩選：</span>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-4 py-1 rounded-full text-sm ${selectedCategory === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                全部
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-1 rounded-full text-sm ${selectedCategory === cat
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">檔案名稱</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">類別</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">關聯對象</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">上傳者</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">上傳時間</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">檔案大小</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {contracts.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            目前沒有合約文件
                                        </td>
                                    </tr>
                                ) : (
                                    contracts.map((contract) => (
                                        <tr key={contract.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FileText size={16} className="text-gray-400 mr-2" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {contract.original_name}
                                                        </div>
                                                        {contract.description && (
                                                            <div className="text-xs text-gray-500">{contract.description}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {contract.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {renderRelatedEntity(contract)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {contract.Uploader?.name || '未知'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(contract.upload_date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatFileSize(contract.file_size)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleDownload(contract.id, contract.original_name)}
                                                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                                        title="下載"
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(contract.id)}
                                                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                                        title="刪除"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentationCenter;
