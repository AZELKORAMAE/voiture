import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Car from '@/models/Car';
import Agency from '@/models/Agency';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const car = await Car.findById(params.id).populate('agencyId', 'name address location');

        if (!car) {
            return NextResponse.json({ message: 'Car not found' }, { status: 404 });
        }

        return NextResponse.json(car);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
