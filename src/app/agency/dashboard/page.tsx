'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from '../../admin/dashboard/Dashboard.module.css'; // Reusing styles
import agencyStyles from './Agency.module.css';
import AddCarModal from '@/components/AddCarModal';

export default function AgencyDashboard() {
    const { data: session, status } = useSession();
    const [agency, setAgency] = useState<any>(null);
    const [cars, setCars] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const router = useRouter();

    // Onboarding form state
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        latitude: 0,
        longitude: 0
    });

    useEffect(() => {
        if (status === 'unauthenticated' || (session?.user as any)?.role !== 'AGENCY') {
            router.push('/');
        } else if (status === 'authenticated') {
            fetchAgency();
        }
    }, [status, session]);

    const fetchAgency = async () => {
        try {
            const res = await fetch('/api/agency');
            if (res.ok) {
                const data = await res.json();
                setAgency(data);
                if (data && data.isApproved) {
                    fetchCars();
                    fetchBookings();
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchCars = async () => {
        try {
            const res = await fetch('/api/agency/cars');
            if (res.ok) {
                const data = await res.json();
                setCars(data);
            }
        } catch (error) {
            console.error('Failed to fetch cars');
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/agency/bookings');
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (error) {
            console.error('Failed to fetch bookings');
        }
    };

    const handleOnboarding = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/agency', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                fetchAgency();
            }
        } catch (error) {
            console.error('Onboarding failed');
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '10rem' }}>Loading...</div>;

    if (!agency) {
        return (
            <div className={agencyStyles.onboardingContainer}>
                <div className={agencyStyles.onboardingCard}>
                    <h1>Complete Your <span>Profile</span></h1>
                    <p>Tell us more about your rental store to get started.</p>
                    <form onSubmit={handleOnboarding} className={agencyStyles.form}>
                        <div className={agencyStyles.inputGroup}>
                            <label>Store Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Elite Motors"
                            />
                        </div>
                        <div className={agencyStyles.inputGroup}>
                            <label>Store Address</label>
                            <input
                                type="text"
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="123 Luxury Ave, Casablanca"
                            />
                        </div>
                        <div className={agencyStyles.inputGroup}>
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="The best luxury cars in the city..."
                            />
                        </div>
                        <div className={agencyStyles.geoInputs}>
                            <div className={agencyStyles.inputGroup}>
                                <label>Latitude</label>
                                <input type="number" step="any" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })} />
                            </div>
                            <div className={agencyStyles.inputGroup}>
                                <label>Longitude</label>
                                <input type="number" step="any" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })} />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary">Register Store</button>
                    </form>
                </div>
            </div>
        );
    }

    if (!agency.isApproved) {
        return (
            <div className={agencyStyles.pendingContainer}>
                <div className={agencyStyles.onboardingCard}>
                    <h1>Application <span>Pending</span></h1>
                    <p>Your store <strong>{agency.name}</strong> has been registered. Our admins are reviewing your request.</p>
                    <p>You will be able to add cars once approved.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className="container">
                <h1 className={styles.title}>Agency <span>Dashboard</span></h1>
                <p className={styles.subtitle}>Manage your car inventory and bookings.</p>

                <div className={agencyStyles.dashboardGrid}>
                    <div className={styles.section}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Your Inventory</h3>
                            <button className="btn-primary" onClick={() => setShowAddModal(true)}>+ Add New Car</button>
                        </div>

                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Car</th>
                                    <th>Category</th>
                                    <th>Specs</th>
                                    <th>Price/Day</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cars.map((car) => (
                                    <tr key={car._id}>
                                        <td>{car.make} {car.model} ({car.year})</td>
                                        <td>{car.category}</td>
                                        <td>{car.specs.transmission} | {car.specs.fuelType}</td>
                                        <td>${car.pricePerDay}</td>
                                        <td className={styles.actions}>
                                            <button style={{ color: 'var(--accent)', fontWeight: '600' }}>Edit</button>
                                        </td>
                                    </tr>
                                ))}
                                {cars.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No cars in inventory yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.section}>
                        <h3>Recent Bookings</h3>
                        {bookings.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>No recent bookings to display.</p>
                        ) : (
                            <table className={styles.table} style={{ marginTop: '1rem' }}>
                                <thead>
                                    <tr>
                                        <th>Car</th>
                                        <th>Customer</th>
                                        <th>Dates</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking: any) => (
                                        <tr key={booking._id}>
                                            <td>{booking.carId?.make} {booking.carId?.model}</td>
                                            <td>{booking.customerId?.name}<br /><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{booking.customerId?.email}</span></td>
                                            <td>
                                                <div style={{ fontSize: '0.9rem' }}>
                                                    From: {new Date(booking.startDate).toLocaleDateString()}<br />
                                                    To: {new Date(booking.endDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: '600', color: 'var(--accent)' }}>${booking.totalAmount}</td>
                                            <td>
                                                <span style={{ padding: '0.25rem 0.5rem', borderRadius: '1rem', background: '#e6f7eb', color: '#1a7f37', fontSize: '0.8rem', fontWeight: 600 }}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {showAddModal && (
                <AddCarModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={fetchCars}
                />
            )}
        </div>
    );
}
