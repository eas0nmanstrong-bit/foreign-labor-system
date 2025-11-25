const { LaborPayment } = require('../models');

const generatePayments = async (laborId, employmentDate) => {
    if (!employmentDate) return;

    const payments = [];
    const startDate = new Date(employmentDate);

    // Check if payments already exist to avoid duplicates (simple check)
    const count = await LaborPayment.count({ where: { labor_id: laborId } });
    if (count > 0) return;

    for (let i = 1; i <= 36; i++) {
        // Calculate due date: employment date + i months
        const dueDate = new Date(startDate);
        dueDate.setMonth(startDate.getMonth() + i);

        // Default fees (can be adjusted later based on rules)
        const serviceFee = 1800; // Example default
        const totalAmount = serviceFee;

        payments.push({
            labor_id: laborId,
            period: i,
            due_date: dueDate.toISOString().split('T')[0],
            service_fee: serviceFee,
            total_amount: totalAmount,
            status: '未收款'
        });
    }

    await LaborPayment.bulkCreate(payments);
};

module.exports = { generatePayments };
