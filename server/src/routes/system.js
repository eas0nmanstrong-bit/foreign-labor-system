const express = require('express');
const { Menu, User, Role, Permission } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

router.get('/menus', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Get user's role and permissions
        const user = await User.findByPk(userId, {
            include: {
                model: Role,
                include: Permission
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userPermissions = user.Role.Permissions.map(p => p.code);

        // 2. Fetch all menus
        const allMenus = await Menu.findAll({
            order: [['order', 'ASC']]
        });

        // 3. Filter menus based on permissions
        const accessibleMenus = allMenus.filter(menu => {
            // If no permission required, everyone can see it
            if (!menu.permission_required) return true;
            // Check if user has the required permission
            return userPermissions.includes(menu.permission_required);
        });

        res.json(accessibleMenus);

    } catch (error) {
        console.error('Error fetching menus:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
