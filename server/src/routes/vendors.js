const express = require('express');
const router = express.Router();
const { Vendor, User } = require('../models');
const { sequelize } = require('../database');
const { Op } = require('sequelize');
const { authenticateToken } = require('../middleware/auth');

// Get all vendors with filtering and search
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { category, status, search, page = 1, limit = 20 } = req.query;

        const where = {};

        if (category) where.category = category;
        if (status) where.status = status;
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { vendor_no: { [Op.like]: `%${search}%` } },
                { contact_person: { [Op.like]: `%${search}%` } }
            ];
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Vendor.findAndCountAll({
            where,
            include: [{ model: User, as: 'Owner', attributes: ['id', 'username', 'name'] }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            vendors: rows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single vendor
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const vendor = await Vendor.findByPk(req.params.id, {
            include: [{ model: User, as: 'Owner', attributes: ['id', 'username', 'name'] }]
        });

        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        res.json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get vendors by category
router.get('/category/:category', authenticateToken, async (req, res) => {
    try {
        const vendors = await Vendor.findAll({
            where: { category: req.params.category },
            include: [{ model: User, as: 'Owner', attributes: ['id', 'username', 'name'] }],
            order: [['name', 'ASC']]
        });

        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get vendor statistics
router.get('/stats/summary', authenticateToken, async (req, res) => {
    try {
        const total = await Vendor.count();
        const active = await Vendor.count({ where: { status: 'active' } });
        const byCategory = await Vendor.findAll({
            attributes: [
                'category',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['category']
        });

        res.json({
            total,
            active,
            inactive: total - active,
            byCategory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create vendor
router.post('/', authenticateToken, async (req, res) => {
    try {
        const vendorData = req.body;

        // Check if vendor_no already exists
        const existing = await Vendor.findOne({ where: { vendor_no: vendorData.vendor_no } });
        if (existing) {
            return res.status(400).json({ message: 'Vendor number already exists' });
        }

        const vendor = await Vendor.create(vendorData);
        res.status(201).json(vendor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update vendor
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const vendor = await Vendor.findByPk(req.params.id);

        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        await vendor.update(req.body);
        res.json(vendor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete vendor
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const vendor = await Vendor.findByPk(req.params.id);

        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        await vendor.destroy();
        res.json({ message: 'Vendor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
