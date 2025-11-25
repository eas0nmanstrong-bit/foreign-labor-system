const { User } = require('./src/models');
const { sequelize } = require('./src/database');

const employeeData = [
    {
        username: 'admin',
        email: 'admin@company.com',
        phone: '02-2345-6789',
        department: '管理部',
        position: '系統管理員',
        hire_date: '2020-01-01'
    },
    {
        username: 'staff',
        email: 'staff@company.com',
        phone: '02-2345-6790',
        department: '業務部',
        position: '業務專員',
        hire_date: '2021-03-15'
    },
    {
        username: '王小明',
        email: 'wang.xiaoming@company.com',
        phone: '0912-345-678',
        department: '業務部',
        position: '資深業務專員',
        hire_date: '2022-06-01'
    },
    {
        username: '李美華',
        email: 'li.meihua@company.com',
        phone: '0923-456-789',
        department: '人資部',
        position: '人資專員',
        hire_date: '2022-08-15'
    },
    {
        username: '張志強',
        email: 'zhang.zhiqiang@company.com',
        phone: '0934-567-890',
        department: '業務部',
        position: '業務經理',
        hire_date: '2021-11-20'
    },
    {
        username: '陳雅婷',
        email: 'chen.yating@company.com',
        phone: '0945-678-901',
        department: '財務部',
        position: '會計專員',
        hire_date: '2023-02-10'
    },
    {
        username: '林建宏',
        email: 'lin.jianhong@company.com',
        phone: '0956-789-012',
        department: '業務部',
        position: '業務專員',
        hire_date: '2023-05-01'
    }
];

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        for (const data of employeeData) {
            const user = await User.findOne({ where: { username: data.username } });
            if (user) {
                await user.update({
                    email: data.email,
                    phone: data.phone,
                    department: data.department,
                    position: data.position,
                    hire_date: data.hire_date
                });
                console.log(`Updated ${data.username}`);
            } else {
                console.log(`User ${data.username} not found`);
            }
        }

        console.log('All employee data updated!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

run();
