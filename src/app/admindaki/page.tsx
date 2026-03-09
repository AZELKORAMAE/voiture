'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './Admindaki.module.css';

export default function AdminDaki() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState('agencies');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/admindaki');
        } else if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
            router.push('/');
        } else if (status === 'authenticated') {
            fetchData();
        }
    }, [status, session, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const endpoint = `/api/admin/${activeTab}`;
            const res = await fetch(endpoint);
            if (res.ok) {
                const result = await res.json();
                setData(result);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAgencyAction = async (agencyId: string, isApproved: boolean) => {
        const res = await fetch('/api/admin/agencies', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agencyId, isApproved }),
        });
        if (res.ok) fetchData();
    };

    const deleteAgency = async (agencyId: string) => {
        if (!confirm('Are you sure you want to delete this agency?')) return;
        const res = await fetch('/api/admin/agencies', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agencyId }),
        });
        if (res.ok) fetchData();
    };

    const handleUserAction = async (userId: string, status: string) => {
        const res = await fetch('/api/admin/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, status }),
        });
        if (res.ok) fetchData();
    };

    const deleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        const res = await fetch('/api/admin/users', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });
        if (res.ok) fetchData();
    };

    if (loading && data.length === 0) return <div className="container" style={{ paddingTop: '10rem' }}>Loading Admin Console...</div>;

    return (
        <div className={styles.container}>
            <div className="container">
                <h1 className={styles.title}>Daki <span>Console</span></h1>
                <p className={styles.subtitle}>Full control over the platform, agencies, and users.</p>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'agencies' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('agencies')}
                    >
                        Agencies
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'users' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'bookings' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        Global Bookings
                    </button>
                </div>

                <div className={styles.section}>
                    {activeTab === 'agencies' && (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Agency</th>
                                    <th>Owner</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((agency: any) => (
                                    <tr key={agency._id}>
                                        <td>
                                            <strong>{agency.name}</strong>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{agency.address}</div>
                                        </td>
                                        <td>{agency.ownerId?.name}<br /><span style={{ fontSize: '0.8rem' }}>{agency.ownerId?.email}</span></td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${agency.isApproved ? styles.statusApproved : styles.statusPending}`}>
                                                {agency.isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className={styles.actions}>
                                            {!agency.isApproved && (
                                                <button className={`${styles.actionBtn} ${styles.approve}`} onClick={() => handleAgencyAction(agency._id, true)}>Approve</button>
                                            )}
                                            <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => deleteAgency(agency._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'users' && (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((u: any) => (
                                    <tr key={u._id}>
                                        <td><strong>{u.name}</strong><br />{u.email}</td>
                                        <td>{u.role}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${u.status === 'APPROVED' ? styles.statusApproved : u.status === 'SUSPENDED' ? styles.statusSuspended : ''}`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className={styles.actions}>
                                            {u.status !== 'SUSPENDED' ? (
                                                <button className={`${styles.actionBtn} ${styles.suspend}`} onClick={() => handleUserAction(u._id, 'SUSPENDED')}>Suspend</button>
                                            ) : (
                                                <button className={`${styles.actionBtn} ${styles.approve}`} onClick={() => handleUserAction(u._id, 'APPROVED')}>Activate</button>
                                            )}
                                            <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => deleteUser(u._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'bookings' && (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Reservation</th>
                                    <th>Client</th>
                                    <th>Agency</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((booking: any) => (
                                    <tr key={booking._id}>
                                        <td>
                                            <strong>{booking.carId?.make} {booking.carId?.model}</strong>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>${booking.totalAmount}</div>
                                        </td>
                                        <td>{booking.customerId?.name}<br />{booking.customerId?.email}</td>
                                        <td>{booking.agencyId?.name}</td>
                                        <td className={styles.bookingDetail}>
                                            <span>From: {new Date(booking.startDate).toLocaleDateString()}</span>
                                            <span>To: {new Date(booking.endDate).toLocaleDateString()}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
