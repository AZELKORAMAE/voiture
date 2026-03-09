import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, role } = await req.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        await dbConnect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            status: role === 'AGENCY' ? 'PENDING' : 'APPROVED' // Agencies need approval
        });

        return NextResponse.json({
            message: 'User created successfully',
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
