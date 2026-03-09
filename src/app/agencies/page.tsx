'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Agencies.module.css';

export default function AgenciesPage() {
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAgencies();
    }, []);

    const fetchAgencies = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/agencies');
            if (res.ok) {
                const data = await res.json();
                setAgencies(data);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className="container">
                <h1 className={styles.title}>Our Trusted <span>Agencies</span></h1>
                <p className={styles.subtitle}>Partnering with the best to give you a premium experience.</p>

                {loading ? (
                    <div className={styles.loader}>Loading trusted agencies...</div>
                ) : (
                    <div className={styles.grid}>
                        {agencies.map((agency: any) => (
                            <Link href={`/cars?agency=${agency._id}`} key={agency._id} className={styles.card}>
                                <div className={styles.info}>
                                    <h3>{agency.name}</h3>
                                    <div className={styles.address}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        {agency.address}
                                    </div>
                                    {agency.description && (
                                        <p className={styles.description}>{agency.description}</p>
                                    )}
                                </div>
                                <div className={styles.action}>
                                    View Cars &rarr;
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && agencies.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <h2>No agencies available right now</h2>
                    </div>
                )}
            </div>
        </div>
    );
}
