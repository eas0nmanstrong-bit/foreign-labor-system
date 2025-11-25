const { sequelize } = require('./src/database');
const { User, Client, Labor, LaborPayment, Role, Permission, Menu, RolePermission } = require('./src/models');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

/**
 * 從備份資料夾恢復資料庫
 * 使用方法: node restore_data.js [backup_folder_name]
 * 例如: node restore_data.js export_2025-11-23T01-00-26
 */

const restoreData = async () => {
    try {
        // Get backup folder from command line argument
        const backupFolderName = process.argv[2];

        if (!backupFolderName) {
            console.error('❌ Error: Please specify backup folder name');
            console.log('Usage: node restore_data.js [backup_folder_name]');
            console.log('\nAvailable backups:');

            const backupDir = path.join(__dirname, 'backups');
            if (fs.existsSync(backupDir)) {
                const folders = fs.readdirSync(backupDir)
                    .filter(f => fs.statSync(path.join(backupDir, f)).isDirectory());
                folders.forEach(f => console.log(`  - ${f}`));
            }
            process.exit(1);
        }

        const backupPath = path.join(__dirname, 'backups', backupFolderName);

        if (!fs.existsSync(backupPath)) {
            console.error(`❌ Backup folder not found: ${backupPath}`);
            process.exit(1);
        }

        console.log(`📦 Restoring data from: ${backupFolderName}\n`);

        // Read summary
        const summary = JSON.parse(fs.readFileSync(path.join(backupPath, 'summary.json'), 'utf8'));
        console.log('Backup Summary:');
        console.log(`  Export Date: ${summary.exportDate}`);
        console.log(`  Users: ${summary.counts.users}`);
        console.log(`  Clients: ${summary.counts.clients}`);
        console.log(`  Labors: ${summary.counts.labors}`);
        console.log(`  Payments: ${summary.counts.payments}`);
        console.log('');

        // WARNING: This will drop all existing data
        console.log('⚠️  WARNING: This will delete all existing data!');
        console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Sync database (recreate tables)
        await sequelize.sync({ force: true });
        console.log('✓ Database tables recreated\n');

        // Restore Roles
        const rolesData = JSON.parse(fs.readFileSync(path.join(backupPath, 'roles.json'), 'utf8'));
        const roleMap = {};
        for (const roleData of rolesData) {
            const role = await Role.create({
                id: roleData.id,
                name: roleData.name,
                description: roleData.description
            });
            roleMap[roleData.id] = role;

            // Restore permissions for this role
            if (roleData.Permissions && roleData.Permissions.length > 0) {
                for (const perm of roleData.Permissions) {
                    let permission = await Permission.findOne({ where: { code: perm.code } });
                    if (!permission) {
                        permission = await Permission.create({
                            code: perm.code,
                            description: perm.description
                        });
                    }
                    await RolePermission.create({
                        role_id: role.id,
                        permission_id: permission.id
                    });
                }
            }
        }
        console.log(`✓ Restored ${rolesData.length} roles`);

        // Restore Menus
        const menusData = JSON.parse(fs.readFileSync(path.join(backupPath, 'menus.json'), 'utf8'));
        for (const menuData of menusData) {
            await Menu.create({
                id: menuData.id,
                label: menuData.label,
                path: menuData.path,
                icon: menuData.icon,
                permission_required: menuData.permission_required,
                parent_id: menuData.parent_id,
                order: menuData.order
            });
        }
        console.log(`✓ Restored ${menusData.length} menus`);

        // Restore Users (with default password)
        const usersData = JSON.parse(fs.readFileSync(path.join(backupPath, 'users.json'), 'utf8'));
        const hashedPassword = await bcrypt.hash('1234', 10); // Default password

        for (const userData of usersData) {
            await User.create({
                id: userData.id,
                username: userData.username,
                password: hashedPassword, // Use default password
                role_id: userData.role_id,
                email: userData.email,
                phone: userData.phone,
                department: userData.department,
                position: userData.position,
                hire_date: userData.hire_date
            });
        }
        console.log(`✓ Restored ${usersData.length} users (password reset to '1234')`);

        // Restore Clients
        const clientsData = JSON.parse(fs.readFileSync(path.join(backupPath, 'clients.json'), 'utf8'));
        for (const clientData of clientsData) {
            await Client.create({
                id: clientData.id,
                client_no: clientData.client_no,
                name: clientData.name,
                tax_id: clientData.tax_id,
                contact_name: clientData.contact_name,
                phone: clientData.phone,
                address: clientData.address,
                industry: clientData.industry,
                dept_code: clientData.dept_code,
                owner_id: clientData.owner_id
            });
        }
        console.log(`✓ Restored ${clientsData.length} clients`);

        // Restore Labors
        const laborsData = JSON.parse(fs.readFileSync(path.join(backupPath, 'labors.json'), 'utf8'));
        for (const laborData of laborsData) {
            await Labor.create({
                id: laborData.id,
                worker_no: laborData.worker_no,
                name_en: laborData.name_en,
                name_zh: laborData.name_zh,
                passport_no: laborData.passport_no,
                entry_date: laborData.entry_date,
                arc_no: laborData.arc_no,
                arc_expiry_date: laborData.arc_expiry_date,
                employment_date: laborData.employment_date,
                residence_address: laborData.residence_address,
                lease_id: laborData.lease_id,
                client_id: laborData.client_id,
                maintenance_id: laborData.maintenance_id
            });
        }
        console.log(`✓ Restored ${laborsData.length} labors`);

        // Restore Payments
        const paymentsData = JSON.parse(fs.readFileSync(path.join(backupPath, 'payments.json'), 'utf8'));
        for (const paymentData of paymentsData) {
            await LaborPayment.create({
                id: paymentData.id,
                period: paymentData.period,
                due_date: paymentData.due_date,
                service_fee: paymentData.service_fee,
                arc_fee: paymentData.arc_fee,
                medical_fee: paymentData.medical_fee,
                tax: paymentData.tax,
                utilities: paymentData.utilities,
                other_fee: paymentData.other_fee,
                total_amount: paymentData.total_amount,
                received_amount: paymentData.received_amount,
                received_date: paymentData.received_date,
                invoice_no: paymentData.invoice_no,
                invoice_date: paymentData.invoice_date,
                note: paymentData.note,
                status: paymentData.status,
                labor_id: paymentData.labor_id
            });
        }
        console.log(`✓ Restored ${paymentsData.length} payments`);

        console.log('\n========================================');
        console.log('✅ Data restoration completed successfully!');
        console.log('========================================');
        console.log('\n⚠️  Note: All user passwords have been reset to: 1234');

    } catch (error) {
        console.error('❌ Error restoring data:', error);
    } finally {
        await sequelize.close();
    }
};

restoreData();
