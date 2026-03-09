import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Booking from '@/models/Booking';
import Car from '@/models/Car';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { carId, startDate, endDate } = await req.json();

        if (!carId || !startDate || !endDate) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        await dbConnect();

        // Fetch car for pricing
        const car = await Car.findById(carId);
        if (!car) return NextResponse.json({ message: 'Car not found' }, { status: 404 });

        // Calculate total amount
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const totalAmount = diffDays * car.pricePerDay;

        // Create booking
        const booking = await Booking.create({
            customerId: (session.user as any).id,
            carId,
            agencyId: car.agencyId,
            startDate: start,
            endDate: end,
            totalAmount,
            status: 'CONFIRMED', // Auto-confirm for now as per simple flow
            receiptUrl: `/receipts/booking-${Date.now()}.pdf` // Mock URL
        });

        // Add to car's unavailability
        car.availability.push({ startDate: start, endDate: end });
        await car.save();

        return NextResponse.json({
            message: 'Booking successful',
            booking
        }, { status: 201 });

    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const bookings = await Booking.find({ customerId: (session.user as any).id })
            .populate('carId', 'make model year')
            .populate('agencyId', 'name address');

        return NextResponse.json(bookings);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
