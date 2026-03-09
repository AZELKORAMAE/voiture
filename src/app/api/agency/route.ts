import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Agency from '@/models/Agency';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'AGENCY') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const agency = await Agency.findOne({ ownerId: (session.user as any).id });

        return NextResponse.json(agency);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'AGENCY') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { name, address, latitude, longitude, description, contactEmail, contactPhone } = await req.json();

        await dbConnect();

        const newAgency = await Agency.create({
            ownerId: (session.user as any).id,
            name,
            address,
            description,
            contactEmail,
            contactPhone,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
            isApproved: false // Always needs admin approval
        });

        return NextResponse.json(newAgency, { status: 201 });
    } catch (error) {
        console.error('Agency creation error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
