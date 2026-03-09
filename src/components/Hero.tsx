'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Hero.module.css';

const Hero = () => {
    const [location, setLocation] = useState('');
    const [loadingGeo, setLoadingGeo] = useState(false);
    const router = useRouter();

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (location) params.append('query', location);
        router.push(`/cars?${params.toString()}`);
    };

    const handleNearMe = () => {
        setLoadingGeo(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    router.push(`/cars?lat=${latitude}&lng=${longitude}`);
                    setLoadingGeo(false);
                },
                (error) => {
                    alert('Geolocation failed. Please check your permissions.');
                    setLoadingGeo(false);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
            setLoadingGeo(false);
        }
    };

    return (
        <section className={styles.hero}>
            <div className={styles.overlay}></div>
            <div className="container">
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>
                        Drive Your <span>Luxury</span> <br /> Anywhere, Anytime.
                    </h1>
                    <p className={styles.subtitle}>
                        Discover elite car rentals from top agencies.
                        Simple, transparent, and built for your adventure.
                    </p>

                    <div className={`${styles.searchBar} glass`}>
                        <div className={styles.searchItem}>
                            <label>Location</label>
                            <input
                                type="text"
                                placeholder="Where are you going?"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className={styles.divider}></div>
                        <div className={styles.searchItem}>
                            <label>Pick-up Date</label>
                            <input type="date" />
                        </div>
                        <div className={styles.divider}></div>
                        <div className={styles.searchItem}>
                            <label>Drop-off Date</label>
                            <input type="date" />
                        </div>
                        <button className="btn-primary" onClick={handleSearch}>Search Cars</button>
                    </div>

                    <div className={styles.nearMe}>
                        <button onClick={handleNearMe} disabled={loadingGeo}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            {loadingGeo ? 'Finding you...' : 'Search Around Me'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
