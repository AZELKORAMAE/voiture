import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Car from '@/models/Car';
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
        if (!agency) return NextResponse.json([], { status: 404 });

        const cars = await Car.find({ agencyId: agency._id });
        return NextResponse.json(cars);
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

        await dbConnect();
        const agency = await Agency.findOne({ ownerId: (session.user as any).id });
        if (!agency || !agency.isApproved) {
            return NextResponse.json({ message: 'Agency not found or not approved' }, { status: 403 });
        }

        const body = await req.json();
        const newCar = await Car.create({
            ...body,
            agencyId: agency._id
        });

        return NextResponse.json(newCar, { status: 201 });
    } catch (error) {
        console.error('Car creation error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
