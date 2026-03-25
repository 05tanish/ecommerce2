import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

        const order = new Order({
            user: req.user._id,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod
        });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'user') {
            query.user = req.user._id;
        } else {
            if (req.query.status) query.status = req.query.status;
        }
        const orders = await Order.find(query).populate('user', 'name email').sort({ createdAt: -1 });
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (req.user.role === 'user' && order.user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = req.body.status;
        order.statusHistory.push({
            status: req.body.status,
            changedBy: req.user._id
        });
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderStats = async (req, res) => {
    try {
        const orders = await Order.find();
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
        const totalProfit = totalRevenue * 0.2; // rough estimate
        const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5);

        const locationStats = await Order.aggregate([
            {
                $group: {
                    _id: { city: "$shippingAddress.city", state: "$shippingAddress.state" },
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        // Refund stats for dashboard
        const refundRequests = orders.filter(o => o.refundStatus !== 'none').length;
        const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

        res.json({
            totalOrders,
            pendingOrders,
            totalRevenue,
            totalProfit,
            recentOrders,
            locationStats,
            refundRequests,
            cancelledOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/orders/:id/refund
export const processRefund = async (req, res) => {
    try {
        const { refundStatus, refundReason, refundAmount } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.refundStatus = refundStatus;
        if (refundReason) order.refundReason = refundReason;
        if (refundAmount) order.refundAmount = refundAmount;
        if (refundStatus === 'completed') order.refundedAt = new Date();

        // If refund approved/completed, also cancel the order
        if (['approved', 'completed'].includes(refundStatus) && order.status !== 'cancelled') {
            order.status = 'cancelled';
            order.statusHistory.push({
                status: 'cancelled',
                changedBy: req.user._id
            });
        }

        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/orders/:id/tracking
export const updateTracking = async (req, res) => {
    try {
        const { trackingNumber, trackingUrl, carrier } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (trackingUrl) order.trackingUrl = trackingUrl;
        if (carrier) order.carrier = carrier;

        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/orders/:id/request-return
export const requestReturn = async (req, res) => {
    try {
        const { refundReason } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Ensure the order belongs to the user
        if (order.user.toString() !== req.user._id.toString() && req.user.role === 'user') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Validate state for return (e.g., must be delivered, no previous refund requested)
        if (order.status !== 'delivered') {
            return res.status(400).json({ message: 'Only delivered orders can be returned' });
        }
        if (order.refundStatus !== 'none') {
            return res.status(400).json({ message: 'Return already requested for this order' });
        }

        order.refundStatus = 'requested';
        if (refundReason) order.refundReason = refundReason;

        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

