import Cart from '../models/Cart.js';

// GET /api/cart
export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/cart — add item
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        const populated = await cart.populate('items.product');
        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/cart/:productId — update quantity
export const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find(
            item => item.product.toString() === req.params.productId
        );

        if (!item) return res.status(404).json({ message: 'Item not in cart' });

        if (quantity <= 0) {
            cart.items = cart.items.filter(
                item => item.product.toString() !== req.params.productId
            );
        } else {
            item.quantity = quantity;
        }

        await cart.save();
        const populated = await cart.populate('items.product');
        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/cart/:productId — remove item
export const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(
            item => item.product.toString() !== req.params.productId
        );

        await cart.save();
        const populated = await cart.populate('items.product');
        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/cart — clear cart
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
