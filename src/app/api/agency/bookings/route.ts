import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Booking from '@/models/Booking';
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

        // Get the agency for this user
        const agency = await Agency.findOne({ ownerId: (session.user as any).id });
        if (!agency) {
            return NextResponse.json({ message: 'Agency not found' }, { status: 404 });
        }

        // Fetch bookings for this agency
        const bookings = await Booking.find({ agencyId: agency._id })
            .populate('carId', 'make model year')
            .populate('customerId', 'name email phone')
            .sort({ createdAt: -1 });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Failed to fetch agency bookings:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
