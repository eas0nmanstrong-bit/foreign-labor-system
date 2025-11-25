const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role_id: { type: DataTypes.INTEGER, allowNull: true },
    employee_id: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    department: { type: DataTypes.STRING },
    position: { type: DataTypes.STRING },
    hire_date: { type: DataTypes.DATEONLY }
});

const Role = sequelize.define('Role', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING }
});

const Permission = sequelize.define('Permission', {
    code: { type: DataTypes.STRING, allowNull: false, unique: true }, // e.g., 'labor:read'
    description: { type: DataTypes.STRING }
});

const Menu = sequelize.define('Menu', {
    label: { type: DataTypes.STRING, allowNull: false },
    path: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING }, // Icon name or code
    permission_required: { type: DataTypes.STRING }, // Permission code required to see this menu
    parent_id: { type: DataTypes.INTEGER, allowNull: true }, // For nested menus
    order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const RolePermission = sequelize.define('RolePermission', {
    role_id: { type: DataTypes.INTEGER, references: { model: Role, key: 'id' } },
    permission_id: { type: DataTypes.INTEGER, references: { model: Permission, key: 'id' } }
});

// Relationships
User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id' });

const Client = sequelize.define('Client', {
    client_no: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    tax_id: { type: DataTypes.STRING }, // Unified Business No. or ID No.
    contact_name: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    industry: { type: DataTypes.STRING },
    dept_code: { type: DataTypes.STRING }, // Department Code
    owner_id: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } }
});

Client.belongsTo(User, { as: 'Owner', foreignKey: 'owner_id' });
User.hasMany(Client, { foreignKey: 'owner_id' });

const Labor = sequelize.define('Labor', {
    worker_no: { type: DataTypes.STRING, allowNull: false, unique: true },
    name_en: { type: DataTypes.STRING, allowNull: false },
    name_zh: { type: DataTypes.STRING },
    passport_no: { type: DataTypes.STRING },
    entry_date: { type: DataTypes.DATEONLY },
    arc_no: { type: DataTypes.STRING },
    arc_expiry_date: { type: DataTypes.DATEONLY },
    employment_date: { type: DataTypes.DATEONLY },
    residence_address: { type: DataTypes.STRING },
    lease_id: { type: DataTypes.INTEGER }, // Placeholder for future relation
    client_id: { type: DataTypes.INTEGER, references: { model: Client, key: 'id' } },
    maintenance_id: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } }
});

Labor.belongsTo(Client, { foreignKey: 'client_id' });
Client.hasMany(Labor, { foreignKey: 'client_id' });

Labor.belongsTo(User, { as: 'Maintenance', foreignKey: 'maintenance_id' });

const LaborPayment = sequelize.define('LaborPayment', {
    period: { type: DataTypes.INTEGER, allowNull: false }, // 1-36
    due_date: { type: DataTypes.DATEONLY },
    service_fee: { type: DataTypes.INTEGER, defaultValue: 0 },
    arc_fee: { type: DataTypes.INTEGER, defaultValue: 0 },
    medical_fee: { type: DataTypes.INTEGER, defaultValue: 0 },
    tax: { type: DataTypes.INTEGER, defaultValue: 0 },
    utilities: { type: DataTypes.INTEGER, defaultValue: 0 },
    other_fee: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_amount: { type: DataTypes.INTEGER, defaultValue: 0 },
    received_amount: { type: DataTypes.INTEGER, defaultValue: 0 },
    received_date: { type: DataTypes.DATEONLY },
    invoice_no: { type: DataTypes.STRING },
    invoice_date: { type: DataTypes.DATEONLY },
    note: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: '未收款' }, // 未收款, 已收款
    labor_id: { type: DataTypes.INTEGER, references: { model: Labor, key: 'id' } }
});

Labor.hasMany(LaborPayment, { foreignKey: 'labor_id' });
LaborPayment.belongsTo(Labor, { foreignKey: 'labor_id' });

const Contract = sequelize.define('Contract', {
    contract_number: { type: DataTypes.STRING, unique: true },
    filename: { type: DataTypes.STRING, allowNull: false },
    original_name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    file_path: { type: DataTypes.STRING, allowNull: false },
    file_size: { type: DataTypes.INTEGER },
    mime_type: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    labor_id: { type: DataTypes.INTEGER, references: { model: Labor, key: 'id' } },
    vendor_id: { type: DataTypes.INTEGER, references: { model: 'Vendors', key: 'id' } },
    client_id: { type: DataTypes.INTEGER, references: { model: 'Clients', key: 'id' } },
    uploaded_by: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
    upload_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

Contract.belongsTo(User, { as: 'Uploader', foreignKey: 'uploaded_by' });
User.hasMany(Contract, { foreignKey: 'uploaded_by' });

Contract.belongsTo(Labor, { foreignKey: 'labor_id' });
Labor.hasMany(Contract, { foreignKey: 'labor_id' });



const Vendor = sequelize.define('Vendor', {
    vendor_no: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    name_en: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING, allowNull: false },
    tax_id: { type: DataTypes.STRING },

    // 聯絡資訊
    contact_person: { type: DataTypes.STRING },
    contact_title: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    mobile: { type: DataTypes.STRING },
    fax: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },

    // 地址資訊
    address: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING, defaultValue: '台灣' },

    // 銀行資訊
    bank_name: { type: DataTypes.STRING },
    bank_account: { type: DataTypes.STRING },
    bank_branch: { type: DataTypes.STRING },

    // 業務資訊
    service_items: { type: DataTypes.TEXT },  // JSON string
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.STRING, defaultValue: 'active' },

    notes: { type: DataTypes.TEXT },
    owner_id: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } }
});

// Vendor relationships
Vendor.belongsTo(User, { as: 'Owner', foreignKey: 'owner_id' });
User.hasMany(Vendor, { foreignKey: 'owner_id' });

// Contract relationships with Vendor and Client
Contract.belongsTo(Vendor, { foreignKey: 'vendor_id' });
Vendor.hasMany(Contract, { foreignKey: 'vendor_id' });

Contract.belongsTo(Client, { foreignKey: 'client_id' });
Client.hasMany(Contract, { foreignKey: 'client_id' });


module.exports = { User, Role, Permission, Menu, RolePermission, Client, Labor, LaborPayment, Contract, Vendor };
