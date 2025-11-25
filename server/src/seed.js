const { sequelize } = require('./database');
const { User, Role, Permission, Menu, RolePermission, Client } = require('./models');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // WARNING: This drops all tables

        // 1. Create Roles
        const adminRole = await Role.create({ name: 'Admin', description: 'Administrator with full access' });
        const staffRole = await Role.create({ name: 'Staff', description: 'Standard staff member' });

        // 2. Create Permissions
        const permissions = [
            { code: 'labor:read', description: 'View labors' },
            { code: 'labor:write', description: 'Create/Edit labors' },
            { code: 'client:read', description: 'View clients' },
            { code: 'client:write', description: 'Create/Edit clients' },
            { code: 'contract:read', description: 'View contracts' },
            { code: 'contract:write', description: 'Create/Edit contracts' },
            { code: 'admin:access', description: 'Access admin panel' },
        ];

        const createdPermissions = {};
        for (const p of permissions) {
            createdPermissions[p.code] = await Permission.create(p);
        }

        // 3. Assign Permissions to Roles
        // Admin gets all
        await adminRole.addPermissions(Object.values(createdPermissions));

        // Staff gets only labor:read and client:read (example)
        await staffRole.addPermissions([
            createdPermissions['labor:read'],
            createdPermissions['labor:write'], // Let's give them write access to labor too
            createdPermissions['client:read']
        ]);

        // 4. Create Menus
        const menus = [
            { label: '儀表板', path: '/dashboard', icon: 'Home', order: 1 },
            { label: '外勞管理', path: '/labors', icon: 'Users', permission_required: 'labor:read', order: 2 },
            { label: '雇主管理', path: '/clients', icon: 'Briefcase', permission_required: 'client:read', order: 3 },
            { label: '合約管理', path: '/contracts', icon: 'FileText', permission_required: 'contract:read', order: 4 },
            { label: '系統管理', path: '/admin', icon: 'Settings', permission_required: 'admin:access', order: 99 },
        ];

        await Menu.bulkCreate(menus);

        // 5. Create Users
        const hashedPassword = await bcrypt.hash('password', 10);

        await User.create({
            username: 'admin',
            password: hashedPassword,
            role_id: adminRole.id
        });

        const staffUser = await User.create({
            username: 'staff',
            password: hashedPassword,
            role_id: staffRole.id
        });

        // 6. Create Clients
        await Client.create({
            client_no: 'C001',
            name: '台積電',
            tax_id: '12345678',
            contact_name: '張先生',
            phone: '0912345678',
            address: '新竹科學園區',
            industry: '製造業',
            dept_code: 'MFG-01',
            owner_id: staffUser.id
        });

        await Client.create({
            client_no: 'C002',
            name: '王大明',
            tax_id: 'A123456789',
            contact_name: '王大明',
            phone: '0987654321',
            address: '台北市信義區',
            industry: '家庭看護',
            dept_code: 'HOME-02',
            owner_id: staffUser.id
        });

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await sequelize.close();
    }
};

seedDatabase();
