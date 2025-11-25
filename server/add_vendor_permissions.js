const { sequelize } = require('./src/database');
const { Permission, Role, RolePermission } = require('./src/models');

const addVendorPermissions = async () => {
    try {
        console.log('Adding vendor permissions...\n');

        // 1. Create vendor permissions if they don't exist
        const [vendorRead, createdRead] = await Permission.findOrCreate({
            where: { code: 'vendor:read' },
            defaults: { description: 'View vendors' }
        });
        console.log(createdRead ? '✅ Created vendor:read permission' : '- vendor:read permission already exists');

        const [vendorWrite, createdWrite] = await Permission.findOrCreate({
            where: { code: 'vendor:write' },
            defaults: { description: 'Create/Edit vendors' }
        });
        console.log(createdWrite ? '✅ Created vendor:write permission' : '- vendor:write permission already exists');

        // 2. Find Admin role
        const adminRole = await Role.findOne({ where: { name: 'Admin' } });
        if (!adminRole) {
            console.error('❌ Admin role not found!');
            return;
        }

        // 3. Add permissions to Admin role
        const [rpRead, createdRPRead] = await RolePermission.findOrCreate({
            where: {
                role_id: adminRole.id,
                permission_id: vendorRead.id
            }
        });
        console.log(createdRPRead ? '✅ Added vendor:read to Admin role' : '- vendor:read already assigned to Admin');

        const [rpWrite, createdRPWrite] = await RolePermission.findOrCreate({
            where: {
                role_id: adminRole.id,
                permission_id: vendorWrite.id
            }
        });
        console.log(createdRPWrite ? '✅ Added vendor:write to Admin role' : '- vendor:write already assigned to Admin');

        console.log('\n========================================');
        console.log('✅ Vendor permissions added successfully!');
        console.log('========================================');
        console.log('\n請重新登入以載入新的權限設定');

    } catch (error) {
        console.error('❌ Error adding vendor permissions:', error);
    } finally {
        await sequelize.close();
    }
};

addVendorPermissions();
