'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import styles from './CarDetails.module.css';

export default function CarDetailsPage() {
    const { id } = useParams();
    const { data: session } = useSession();
    const router = useRouter();
    const [car, setCar] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [bookingDates, setBookingDates] = useState({
        startDate: '',
        endDate: ''
    });
    const [bookingStatus, setBookingStatus] = useState('');

    useEffect(() => {
        fetchCar();
    }, [id]);

    const fetchCar = async () => {
        try {
            const res = await fetch(`/api/cars/${id}`); // Needs specific car API
            if (res.ok) {
                const data = await res.json();
                setCar(data);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            router.push('/login');
            return;
        }

        setBookingStatus('Processing...');
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    carId: id,
                    ...bookingDates
                }),
            });

            if (res.ok) {
                setBookingStatus('Booking Confirmed! Redirecting...');
                setTimeout(() => router.push('/profile'), 2000);
            } else {
                setBookingStatus('Failed to book. Try again.');
            }
        } catch (error) {
            setBookingStatus('An error occurred.');
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '10rem' }}>Loading details...</div>;
    if (!car) return <div className="container" style={{ paddingTop: '10rem' }}>Car not found.</div>;

    return (
        <div className={styles.container}>
            <div className="container">
                <div className={styles.layout}>
                    <div className={styles.mainContent}>
                        <div className={styles.imageGallery}>
                            {car.images?.[0] ? (
                                <Image src={car.images[0]} alt={car.model} fill style={{ objectFit: 'cover' }} />
                            ) : (
                                <div className={styles.imagePlaceholder}>No Image Available</div>
                            )}
                        </div>

                        <div className={styles.details}>
                            <h1>{car.make} {car.model} <span>({car.year})</span></h1>
                            <p className={styles.category}>{car.category}</p>
                            <p className={styles.agency}>Managed by <strong>{car.agencyId?.name}</strong></p>

                            <div className={styles.specsGrid}>
                                {(!car.visibleFields || car.visibleFields.includes('transmission')) && (
                                    <div className={styles.specItem}>
                                        <label>Transmission</label>
                                        <span>{car.specs.transmission}</span>
                                    </div>
                                )}
                                {(!car.visibleFields || car.visibleFields.includes('fuelType')) && (
                                    <div className={styles.specItem}>
                                        <label>Fuel</label>
                                        <span>{car.specs.fuelType}</span>
                                    </div>
                                )}
                                {(!car.visibleFields || car.visibleFields.includes('seats')) && (
                                    <div className={styles.specItem}>
                                        <label>Seats</label>
                                        <span>{car.specs.seats}</span>
                                    </div>
                                )}
                                {((!car.visibleFields && car.specs.power) || (car.visibleFields && car.visibleFields.includes('power') && car.specs.power)) && (
                                    <div className={styles.specItem}>
                                        <label>Power</label>
                                        <span>{car.specs.power}</span>
                                    </div>
                                )}
                                {car.visibleFields && car.visibleFields.includes('maxSpeed') && car.specs.maxSpeed && (
                                    <div className={styles.specItem}>
                                        <label>Max Speed</label>
                                        <span>{car.specs.maxSpeed}</span>
                                    </div>
                                )}
                                {car.visibleFields && car.visibleFields.includes('color') && car.specs.color && (
                                    <div className={styles.specItem}>
                                        <label>Color</label>
                                        <span>{car.specs.color}</span>
                                    </div>
                                )}
                                {car.visibleFields && car.visibleFields.includes('insuranceType') && car.specs.insuranceType && (
                                    <div className={styles.specItem}>
                                        <label>Insurance</label>
                                        <span>{car.specs.insuranceType}</span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.description}>
                                <h3>Features</h3>
                                <ul>
                                    {car.features?.map((f: string, i: number) => <li key={i}>{f}</li>) || <li>Standard Features</li>}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <aside className={styles.sidebar}>
                        <div className={`${styles.bookingCard} glass`}>
                            <div className={styles.price}>
                                <span>${car.pricePerDay}</span> / day
                            </div>

                            <form onSubmit={handleBooking} className={styles.form}>
                                <div className={styles.inputGroup}>
                                    <label>Pick-up Date</label>
                                    <input type="date" required value={bookingDates.startDate} onChange={e => setBookingDates({ ...bookingDates, startDate: e.target.value })} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Drop-off Date</label>
                                    <input type="date" required value={bookingDates.endDate} onChange={e => setBookingDates({ ...bookingDates, endDate: e.target.value })} />
                                </div>

                                <button type="submit" className="btn-primary" style={{ width: '100%' }}>Book this Car</button>
                                {bookingStatus && <p className={styles.status}>{bookingStatus}</p>}
                            </form>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
