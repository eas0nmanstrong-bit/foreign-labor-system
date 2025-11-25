const { Menu } = require('./src/models');
const { connectDB } = require('./src/database');

const addDocumentationMenu = async () => {
    try {
        await connectDB();

        // Check if menu already exists
        const existing = await Menu.findOne({ where: { path: '/documentation' } });

        if (existing) {
            console.log('⚠️  Documentation menu already exists');
            process.exit(0);
        }

        // Create new menu item
        const menu = await Menu.create({
            label: '文檔中心',
            path: '/documentation',
            icon: '📚',
            order: 999,
            permission_required: null,
            parent_id: null
        });

        console.log('✅ Documentation center menu added successfully!');
        console.log(`Menu ID: ${menu.id}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

addDocumentationMenu();
