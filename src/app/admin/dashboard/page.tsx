'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated' || (session?.user as any)?.role !== 'ADMIN') {
            router.push('/');
        } else {
            fetchAgencies();
        }
    }, [status, session]);

    const fetchAgencies = async () => {
        try {
            const res = await fetch('/api/admin/agencies');
            if (res.ok) {
                const data = await res.json();
                setAgencies(data);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (agencyId: string, isApproved: boolean) => {
        try {
            const res = await fetch('/api/admin/agencies', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agencyId, isApproved }),
            });
            if (res.ok) {
                fetchAgencies();
            }
        } catch (error) {
            console.error('Failed to update status');
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '10rem' }}>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className="container">
                <h1 className={styles.title}>Admin <span>Dashboard</span></h1>
                <p className={styles.subtitle}>Manage agency approvals and platform status.</p>

                <div className={styles.section}>
                    <h2>Pending Approvals</h2>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Agency Name</th>
                                    <th>Owner</th>
                                    <th>Email</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agencies.filter(a => !a.isApproved).map((agency: any) => (
                                    <tr key={agency._id}>
                                        <td>{agency.name}</td>
                                        <td>{agency.ownerId?.name}</td>
                                        <td>{agency.ownerId?.email}</td>
                                        <td>{agency.address}</td>
                                        <td><span className={styles.statusPending}>Pending</span></td>
                                        <td className={styles.actions}>
                                            <button
                                                className={styles.approveBtn}
                                                onClick={() => handleStatusUpdate(agency._id, true)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className={styles.rejectBtn}
                                                onClick={() => handleStatusUpdate(agency._id, false)}
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {agencies.filter(a => !a.isApproved).length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No pending agencies.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
