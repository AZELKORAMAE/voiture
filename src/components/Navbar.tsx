'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { data: session } = useSession();
    const user = session?.user as any;

    return (
        <nav className={styles.navbar}>
            <div className="container">
                <div className={styles.navContent}>
                    <Link href="/" className={styles.logo}>
                        CAR<span>RENT</span>
                    </Link>

                    <div className={styles.navLinks}>
                        <Link href="/cars">Find a Car</Link>
                        <Link href="/agencies">Agencies</Link>
                        {user?.role === 'ADMIN' && <Link href="/admindaki">Daki Console</Link>}
                        {user?.role === 'AGENCY' && <Link href="/agency/dashboard">Agency Panel</Link>}
                    </div>

                    <div className={styles.navActions}>
                        {session ? (
                            <>
                                <span className={styles.userName}>Hello, {user?.name}</span>
                                <button onClick={() => signOut()} className={styles.loginBtn}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className={styles.loginBtn}>Login</Link>
                                <Link href="/register" className="btn-primary">Become a Partner</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
