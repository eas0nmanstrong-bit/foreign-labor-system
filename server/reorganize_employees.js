const { User, Client, Labor } = require('./src/models');
const { sequelize } = require('./src/database');
const bcrypt = require('bcrypt');

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Get admin and staff users
        const adminUser = await User.findOne({ where: { username: 'admin' } });
        const staffUser = await User.findOne({ where: { username: 'staff' } });

        if (!adminUser || !staffUser) {
            console.error('Admin or Staff user not found!');
            return;
        }

        // 1. Update all Clients and Labors owned by staff to admin
        await Client.update({ owner_id: adminUser.id }, { where: { owner_id: staffUser.id } });
        await Labor.update({ maintenance_id: adminUser.id }, { where: { maintenance_id: staffUser.id } });
        console.log('Updated Client and Labor references from staff to admin');

        // 2. Delete staff user
        await staffUser.destroy();
        console.log('Deleted staff user');

        // 3. Delete other employees (except admin)
        const otherUsers = await User.findAll({
            where: {
                username: {
                    [require('sequelize').Op.and]: [
                        { [require('sequelize').Op.ne]: 'admin' },
                        { [require('sequelize').Op.ne]: 'staff' }
                    ]
                }
            }
        });

        for (const user of otherUsers) {
            try {
                await user.destroy();
                console.log(`Deleted user: ${user.username}`);
            } catch (e) {
                console.log(`Could not delete ${user.username}:`, e.message);
            }
        }

        // 4. Create new employees with proper IDs and data
        const hashedPassword = await bcrypt.hash('password', 10);
        const staffRole = await require('./src/models').Role.findOne({ where: { name: 'Staff' } });

        const employees = [
            {
                id: 1200001,
                username: '王小明',
                email: 'wang.xiaoming@company.com',
                phone: '0912-345-678',
                department: '業務部',
                position: '業務專員',
                hire_date: '2022-06-01'
            },
            {
                id: 1200002,
                username: '李美華',
                email: 'li.meihua@company.com',
                phone: '0923-456-789',
                department: '業務部',
                position: '業務專員',
                hire_date: '2022-08-15'
            },
            {
                id: 1200003,
                username: '張志強',
                email: 'zhang.zhiqiang@company.com',
                phone: '0934-567-890',
                department: '維護部',
                position: '維護人員',
                hire_date: '2021-11-20'
            },
            {
                id: 1200004,
                username: '陳雅婷',
                email: 'chen.yating@company.com',
                phone: '0945-678-901',
                department: '維護部',
                position: '維護人員',
                hire_date: '2023-02-10'
            },
            {
                id: 1200005,
                username: '林建宏',
                email: 'lin.jianhong@company.com',
                phone: '0956-789-012',
                department: '維護部',
                position: '維護人員',
                hire_date: '2023-05-01'
            }
        ];

        for (const emp of employees) {
            await User.create({
                id: emp.id,
                username: emp.username,
                password: hashedPassword,
                role_id: staffRole.id,
                email: emp.email,
                phone: emp.phone,
                department: emp.department,
                position: emp.position,
                hire_date: emp.hire_date
            });
            console.log(`Created employee: ${emp.username} (ID: ${emp.id})`);
        }

        // 5. Update admin user details
        await adminUser.update({
            email: 'admin@company.com',
            phone: '02-2345-6789',
            department: '管理部',
            position: '系統管理員',
            hire_date: '2020-01-01'
        });
        console.log('Updated admin user details');

        console.log('All updates completed!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

run();
