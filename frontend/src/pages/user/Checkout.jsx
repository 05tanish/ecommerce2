import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';

export default function Checkout() {
    const navigate = useNavigate();
    const { items, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'cod'
    });

    const deliveryCharge = cartTotal >= 500 ? 0 : 40;
    const total = cartTotal + deliveryCharge;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const orderData = {
                items: items.map(item => ({
                    product: item.product?._id,
                    name: item.product?.name,
                    price: item.product?.price,
                    quantity: item.quantity
                })),
                totalAmount: total,
                shippingAddress: {
                    name: form.name,
                    phone: form.phone,
                    street: form.street,
                    city: form.city,
                    state: form.state,
                    pincode: form.pincode
                },
                paymentMethod: form.paymentMethod,
            };

            await API.post('/orders', orderData);
            await clearCart();
            navigate('/my-orders', { state: { orderPlaced: true } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="page container animate-fadeIn">
                <div className="empty-state">
                    <div className="icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Add items to your cart before checkout</p>
                    <Link to="/products" className="btn btn-primary">Shop Now</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page container animate-fadeIn">
            <div className="page-header">
                <h1>Checkout</h1>
                <p>Complete your order</p>
            </div>

            {error && <div className="alert alert-danger" style={{ marginBottom: 24 }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
                <form onSubmit={handleSubmit}>
                    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                        <h3 style={{ marginBottom: 20 }}>Shipping Address</h3>
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input className="form-control" value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input className="form-control" value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Street Address</label>
                            <input className="form-control" value={form.street}
                                onChange={e => setForm({ ...form, street: e.target.value })} required />
                        </div>
                        <div className="grid grid-3">
                            <div className="form-group">
                                <label>City</label>
                                <input className="form-control" value={form.city}
                                    onChange={e => setForm({ ...form, city: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input className="form-control" value={form.state}
                                    onChange={e => setForm({ ...form, state: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Pincode</label>
                                <input className="form-control" value={form.pincode}
                                    onChange={e => setForm({ ...form, pincode: e.target.value })} required />
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                        <h3 style={{ marginBottom: 16 }}>Payment Method</h3>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: 8, background: form.paymentMethod === 'cod' ? 'rgba(232,117,26,0.06)' : 'transparent' }}>
                            <input type="radio" name="payment" value="cod" checked={form.paymentMethod === 'cod'}
                                onChange={() => setForm({ ...form, paymentMethod: 'cod' })} />
                            <span>💵 Cash on Delivery (COD)</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: form.paymentMethod === 'online' ? 'rgba(232,117,26,0.06)' : 'transparent' }}>
                            <input type="radio" name="payment" value="online" checked={form.paymentMethod === 'online'}
                                onChange={() => setForm({ ...form, paymentMethod: 'online' })} />
                            <span>💳 Online Payment (Coming Soon)</span>
                        </label>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}
                        style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
                        {loading ? 'Placing Order...' : `Place Order — ₹${total}`}
                    </button>
                </form>

                {/* Order Summary */}
                <div className="card" style={{ padding: 24, position: 'sticky', top: 100 }}>
                    <h3 style={{ marginBottom: 20 }}>Order Summary</h3>
                    {items.map(item => (
                        <div key={item.product?._id || item._id} style={{
                            display: 'flex', justifyContent: 'space-between', marginBottom: 10,
                            fontSize: '0.88rem', paddingBottom: 8, borderBottom: '1px solid var(--border)'
                        }}>
                            <span>{item.product?.name} × {item.quantity}</span>
                            <span style={{ fontWeight: 600 }}>₹{(item.product?.price || 0) * item.quantity}</span>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: '0.9rem' }}>
                        <span>Subtotal</span>
                        <span>₹{cartTotal}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.9rem', color: 'var(--success)' }}>
                        <span>Delivery</span>
                        <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                    </div>
                    <hr style={{ border: '0', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--primary-light)' }}>₹{total}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
