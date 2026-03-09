'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CarCard from '@/components/CarCard';
import styles from './Cars.module.css';

function CarsContent() {
    const searchParams = useSearchParams();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const agencyParam = searchParams.get('agency');
    const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
    const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

    useEffect(() => {
        fetchCars();
    }, [searchParams, category, agencyParam, startDate, endDate]);

    const fetchCars = async () => {
        setLoading(true);
        try {
            const lat = searchParams.get('lat');
            const lng = searchParams.get('lng');
            let url = `/api/cars?`;
            if (category) url += `category=${category}&`;
            if (agencyParam) url += `agencyId=${agencyParam}&`;
            if (lat && lng) url += `lat=${lat}&lng=${lng}&`;
            if (startDate && endDate) url += `startDate=${startDate}&endDate=${endDate}&`;

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setCars(data);
            }
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Luxury', 'SUV', 'Economy', 'Sport', 'Electric'];

    return (
        <div className={styles.container}>
            <div className="container">
                <h1 className={styles.title}>Available <span>Cars</span></h1>

                <div className={styles.filters}>
                    <button
                        className={!category ? styles.activeFilter : ''}
                        onClick={() => setCategory('')}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={category === cat ? styles.activeFilter : ''}
                            onClick={() => setCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '2rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Pick-up Date</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--background)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Drop-off Date</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--background)' }} />
                    </div>
                </div>

                {loading ? (
                    <div className={styles.loader}>Searching for the best deals...</div>
                ) : (
                    <div className={styles.grid}>
                        {cars.map((car: any) => (
                            <CarCard key={car._id} car={car} />
                        ))}
                    </div>
                )}

                {!loading && cars.length === 0 && (
                    <div className={styles.empty}>
                        <h2>No cars found</h2>
                        <p>Try adjusting your filters or location.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CarsPage() {
    return (
        <Suspense fallback={<div className="container" style={{ paddingTop: '10rem' }}>Loading Marketplace...</div>}>
            <CarsContent />
        </Suspense>
    );
}
