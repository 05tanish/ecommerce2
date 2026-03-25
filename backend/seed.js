import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});

        console.log('🗑️  Cleared existing data');

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@sangamnamkeen.com',
            password: 'admin123',
            role: 'admin',
            phone: '9876543210'
        });

        // Create staff users
        const staff1 = await User.create({
            name: 'Staff Member 1',
            email: 'staff@sangamnamkeen.com',
            password: 'staff123',
            role: 'staff',
            phone: '9876543211'
        });

        const staff2 = await User.create({
            name: 'Staff Member 2',
            email: 'staff2@sangamnamkeen.com',
            password: 'staff123',
            role: 'staff',
            phone: '9876543213'
        });

        // Create test user
        const user = await User.create({
            name: 'Test Customer',
            email: 'user@test.com',
            password: 'user123',
            role: 'user',
            phone: '9876543212',
            address: {
                street: '123 MG Road',
                city: 'Jaipur',
                state: 'Rajasthan',
                pincode: '302001'
            }
        });

        console.log('👤 Users created');

        // Create categories
        const categories = await Category.insertMany([
            { name: 'Namkeen Mix', description: 'Traditional mixed namkeen varieties' },
            { name: 'Bhujia', description: 'Crispy bhujia and sev varieties' },
            { name: 'Chips & Papdi', description: 'Crunchy chips, papdi and papad' },
            { name: 'Sweets', description: 'Traditional Indian sweets and mithai' },
            { name: 'Special Combos', description: 'Gift packs and combo offers' }
        ]);

        console.log('📂 Categories created');

        // Create products
        const products = await Product.insertMany([
            {
                name: 'Aloo Bhujia',
                description: 'Crispy and spicy potato-based bhujia made with traditional spices. A perfect tea-time snack that melts in your mouth.',
                price: 120,
                costPrice: 85,
                category: categories[1]._id,
                stock: 100,
                weight: '400g',
                brand: 'Sangam Namkeen',
                tags: ['spicy', 'crispy', 'tea-time', 'potato', 'bestseller'],
                totalSold: 245,
                isFeatured: true
            },
            {
                name: 'Moong Dal Namkeen',
                description: 'Crunchy salted moong dal, lightly spiced with turmeric and chilli. A healthy and addictive snack.',
                price: 90,
                costPrice: 60,
                category: categories[0]._id,
                stock: 80,
                weight: '250g',
                brand: 'Sangam Namkeen',
                tags: ['healthy', 'crunchy', 'dal', 'light', 'protein'],
                totalSold: 180,
                isFeatured: true
            },
            {
                name: 'Bikaneri Bhujia',
                description: 'Authentic Bikaneri-style moth dal bhujia with the perfect crunch and spice level. Our bestseller!',
                price: 150,
                costPrice: 105,
                category: categories[1]._id,
                stock: 120,
                weight: '500g',
                brand: 'Sangam Namkeen',
                tags: ['bikaneri', 'authentic', 'spicy', 'bestseller', 'traditional'],
                totalSold: 320,
                isFeatured: true
            },
            {
                name: 'Mixture Namkeen',
                description: 'A delightful mix of sev, peanuts, dal, and crispy elements tossed in aromatic spices.',
                price: 100,
                costPrice: 70,
                category: categories[0]._id,
                stock: 90,
                weight: '300g',
                brand: 'Sangam Namkeen',
                tags: ['mix', 'peanuts', 'party', 'crunchy', 'classic'],
                totalSold: 150,
                isFeatured: false
            },
            {
                name: 'Mathri',
                description: 'Flaky and crispy traditional mathri made with ajwain (carom seeds). Perfect with chai!',
                price: 110,
                costPrice: 75,
                category: categories[2]._id,
                stock: 70,
                weight: '350g',
                brand: 'Sangam Namkeen',
                tags: ['flaky', 'traditional', 'chai-time', 'ajwain', 'crispy'],
                totalSold: 200,
                isFeatured: true
            },
            {
                name: 'Kaju Katli',
                description: 'Premium cashew barfi made with pure ghee and fine cashews. Delicate, rich and melt-in-mouth.',
                price: 450,
                costPrice: 320,
                category: categories[3]._id,
                stock: 50,
                weight: '250g',
                brand: 'Sangam Namkeen',
                tags: ['premium', 'cashew', 'sweet', 'gifting', 'festive', 'rich'],
                totalSold: 280,
                isFeatured: true
            },
            {
                name: 'Soan Papdi',
                description: 'Light and flaky soan papdi with cardamom flavour, garnished with pistachios.',
                price: 200,
                costPrice: 140,
                category: categories[3]._id,
                stock: 60,
                weight: '500g',
                brand: 'Sangam Namkeen',
                tags: ['light', 'flaky', 'cardamom', 'festive', 'sweet'],
                totalSold: 160,
                isFeatured: false
            },
            {
                name: 'Masala Chips',
                description: 'Thick-cut potato chips seasoned with our secret masala blend. Extra crunchy!',
                price: 80,
                costPrice: 55,
                category: categories[2]._id,
                stock: 100,
                weight: '200g',
                brand: 'Sangam Namkeen',
                tags: ['masala', 'chips', 'crunchy', 'snack', 'potato'],
                totalSold: 190,
                isFeatured: false
            },
            {
                name: 'Khatta Meetha',
                description: 'Sweet and tangy namkeen mix with peanuts, sev, and raisins. A unique flavour explosion.',
                price: 95,
                costPrice: 65,
                category: categories[0]._id,
                stock: 85,
                weight: '300g',
                brand: 'Sangam Namkeen',
                tags: ['sweet', 'tangy', 'mix', 'peanuts', 'unique'],
                totalSold: 175,
                isFeatured: true
            },
            {
                name: 'Dal Moth',
                description: 'Spicy and crunchy moth dal snack with curry leaves flavoring. A classic favourite.',
                price: 85,
                costPrice: 60,
                category: categories[0]._id,
                stock: 75,
                weight: '250g',
                brand: 'Sangam Namkeen',
                tags: ['spicy', 'crunchy', 'dal', 'classic', 'curry-leaves'],
                totalSold: 130,
                isFeatured: false
            },
            {
                name: 'Rasgulla',
                description: 'Soft and spongy chhena balls soaked in light sugar syrup. A bengali classic.',
                price: 250,
                costPrice: 180,
                category: categories[3]._id,
                stock: 40,
                weight: '500g (12 pcs)',
                brand: 'Sangam Namkeen',
                tags: ['sweet', 'bengali', 'soft', 'syrup', 'classic'],
                totalSold: 95,
                isFeatured: false
            },
            {
                name: 'Festival Gift Pack',
                description: 'A premium gift box with Bikaneri Bhujia, Kaju Katli, Mixture, and Soan Papdi. Perfect for gifting!',
                price: 799,
                costPrice: 550,
                category: categories[4]._id,
                stock: 30,
                weight: '1.5 kg',
                brand: 'Sangam Namkeen',
                tags: ['gift', 'festive', 'premium', 'combo', 'diwali', 'rakhi'],
                totalSold: 110,
                isFeatured: true
            }
        ]);

        console.log(`🍿 ${products.length} Products created`);

        console.log('\n✅ Seed completed successfully!');
        console.log('─────────────────────────────');
        console.log('Admin login:  admin@sangamnamkeen.com / admin123');
        console.log('Staff login:  staff@sangamnamkeen.com / staff123');
        console.log('User login:   user@test.com / user123');
        console.log('─────────────────────────────');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
};

seedData();
