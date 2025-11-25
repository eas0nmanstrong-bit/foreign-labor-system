import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const [menus, setMenus] = useState([]);
    const [expandedMenus, setExpandedMenus] = useState({});
    const { user, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await api.get('/system/menus');
                setMenus(response.data);

                // Auto-expand parent menus if current path matches a child
                const expanded = {};
                response.data.forEach(menu => {
                    if (menu.parent_id) {
                        const parent = response.data.find(m => m.id === menu.parent_id);
                        if (parent && location.pathname.startsWith(menu.path)) {
                            expanded[parent.id] = true;
                        }
                    }
                });
                setExpandedMenus(expanded);
            } catch (error) {
                console.error('Failed to fetch menus:', error);
            }
        };

        if (user) {
            fetchMenus();
        }
    }, [user, location.pathname]);

    const toggleMenu = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    // Organize menus into parent-child structure
    const parentMenus = menus.filter(menu => !menu.parent_id);
    const getChildMenus = (parentId) => menus.filter(menu => menu.parent_id === parentId);

    const isActive = (menuPath) => location.pathname === menuPath || location.pathname.startsWith(menuPath + '/');

    const hasActiveChild = (parentId) => {
        const children = getChildMenus(parentId);
        return children.some(child => isActive(child.path));
    };

    return (
        <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
            <div className="p-4 text-xl font-bold border-b border-gray-700">
                外勞仲介系統
            </div>
            <div className="p-4 border-b border-gray-700">
                <p className="text-sm text-gray-400">歡迎, {user?.username}</p>
                <p className="text-xs text-gray-500 uppercase">{user?.role}</p>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
                <ul>
                    {parentMenus.map((menu) => {
                        const children = getChildMenus(menu.id);
                        const hasChildren = children.length > 0;
                        const isExpanded = expandedMenus[menu.id];
                        const isParentActive = isActive(menu.path) || hasActiveChild(menu.id);

                        return (
                            <li key={menu.id}>
                                {hasChildren ? (
                                    <>
                                        <div
                                            onClick={() => toggleMenu(menu.id)}
                                            className={`flex items-center justify-between px-4 py-2 hover:bg-gray-700 transition-colors cursor-pointer ${isParentActive ? 'bg-gray-700 border-l-4 border-blue-500' : ''
                                                }`}
                                        >
                                            <span>{menu.label}</span>
                                            <svg
                                                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                        {isExpanded && (
                                            <ul className="bg-gray-900">
                                                {children.map((child) => (
                                                    <li key={child.id}>
                                                        <Link
                                                            to={child.path}
                                                            className={`block pl-8 pr-4 py-2 hover:bg-gray-700 transition-colors ${isActive(child.path) ? 'bg-gray-700 border-l-4 border-blue-500' : ''
                                                                }`}
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        to={menu.path}
                                        className={`block px-4 py-2 hover:bg-gray-700 transition-colors ${isActive(menu.path) ? 'bg-gray-700 border-l-4 border-blue-500' : ''
                                            }`}
                                    >
                                        {menu.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={logout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
                >
                    登出
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
