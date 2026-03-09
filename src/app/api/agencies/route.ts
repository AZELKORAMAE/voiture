import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Agency from '@/models/Agency';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        const agencies = await Agency.find({ isApproved: true })
            .populate('ownerId', 'name email')
            .lean();
        return NextResponse.json(agencies);
    } catch (error) {
        console.error('Failed to fetch agencies:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
