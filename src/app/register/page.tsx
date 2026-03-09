'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Register.module.css';
import Link from 'next/link';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'CUSTOMER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/login?registered=true');
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Create your <span>Account</span></h1>
                <p className={styles.subtitle}>Join our premium rental network today.</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.roleToggle}>
                        <button
                            type="button"
                            className={formData.role === 'CUSTOMER' ? styles.activeRole : ''}
                            onClick={() => setFormData({ ...formData, role: 'CUSTOMER' })}
                        >
                            Customer
                        </button>
                        <button
                            type="button"
                            className={formData.role === 'AGENCY' ? styles.activeRole : ''}
                            onClick={() => setFormData({ ...formData, role: 'AGENCY' })}
                        >
                            Agency / Store
                        </button>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Processing...' : 'Create Account'}
                    </button>

                    <p className={styles.loginLink}>
                        Already have an account? <Link href="/login">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
