import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Car from '@/models/Car';
import Agency from '@/models/Agency';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        const distance = searchParams.get('distance') || '50000'; // Default 50km

        await dbConnect();

        let query: any = {};
        if (category) query.category = category;

        // Location search
        if (lat && lng) {
            const agenciesNearMe = await Agency.find({
                location: {
                    $near: {
                        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                        $maxDistance: parseInt(distance)
                    }
                }
            }).select('_id');

            const agencyIds = agenciesNearMe.map(a => a._id);
            query.agencyId = { $in: agencyIds };
        }

        const cars = await Car.find(query).populate('agencyId', 'name address location');

        return NextResponse.json(cars);
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
