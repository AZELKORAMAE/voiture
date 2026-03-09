'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CarCard from '@/components/CarCard';
import styles from './Cars.module.css';

export default function CarsPage() {
    const searchParams = useSearchParams();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState(searchParams.get('category') || '');

    useEffect(() => {
        fetchCars();
    }, [searchParams, category]);

    const fetchCars = async () => {
        setLoading(true);
        try {
            const lat = searchParams.get('lat');
            const lng = searchParams.get('lng');
            let url = `/api/cars?`;
            if (category) url += `category=${category}&`;
            if (lat && lng) url += `lat=${lat}&lng=${lng}&`;

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
