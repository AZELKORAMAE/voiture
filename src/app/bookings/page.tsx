'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './Bookings.module.css';

export default function BookingsPage() {
    const { status } = useSession();
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchBookings();
        }
    }, [status]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/bookings');
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading || status === 'loading') {
        return <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>Loading your reservations...</div>;
    }

    return (
        <div className={styles.container}>
            <div className="container">
                <h1 className={styles.title}>My <span>Reservations</span></h1>

                {bookings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', background: 'var(--foreground)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                        <h2>You have no bookings yet.</h2>
                        <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => router.push('/cars')}>Explore Cars</button>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {bookings.map((booking: any) => (
                            <div key={booking._id} className={styles.card}>
                                <div className={styles.carInfo}>
                                    <h3>{booking.carId?.make} {booking.carId?.model}</h3>
                                    <p>{booking.carId?.year} • Delivered by {booking.agencyId?.name}</p>
                                </div>
                                <div className={styles.details}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Pick-up</span>
                                        <span className={styles.detailValue}>{new Date(booking.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Drop-off</span>
                                        <span className={styles.detailValue}>{new Date(booking.endDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Total</span>
                                        <span className={styles.price}>${booking.totalAmount}</span>
                                    </div>
                                    <div>
                                        <span className={styles.status}>{booking.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
