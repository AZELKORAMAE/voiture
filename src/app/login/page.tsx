'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../register/Register.module.css'; // Reusing styles
import Link from 'next/link';

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError('Invalid email or password');
            } else {
                router.push('/');
                router.refresh();
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
                <h1 className={styles.title}>Welcome <span>Back</span></h1>
                <p className={styles.subtitle}>Sign in to manage your rentals.</p>

                {registered && (
                    <p style={{ color: 'var(--accent)', marginBottom: '1rem', fontWeight: '500' }}>
                        Registration successful! Please sign in.
                    </p>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p className={styles.loginLink}>
                        Don't have an account? <Link href="/register">Create one</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={<div className="container" style={{ paddingTop: '10rem' }}>Loading Sign In...</div>}>
            <LoginContent />
        </Suspense>
    );
}
