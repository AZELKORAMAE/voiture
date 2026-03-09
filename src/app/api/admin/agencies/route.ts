import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Agency from '@/models/Agency';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const status = req.nextUrl.searchParams.get('status');
        const query = status ? { isApproved: status === 'approved' } : {};

        const agencies = await Agency.find(query).populate('ownerId', 'name email');

        return NextResponse.json(agencies);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { agencyId, isApproved } = await req.json();

        await dbConnect();

        const agency = await Agency.findByIdAndUpdate(agencyId, { isApproved }, { new: true });

        return NextResponse.json({ message: 'Agency status updated', agency });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
