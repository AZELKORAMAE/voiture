import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
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
                        <Link href="/about">How it Works</Link>
                    </div>

                    <div className={styles.navActions}>
                        <Link href="/login" className={styles.loginBtn}>Login</Link>
                        <Link href="/register" className="btn-primary">Become a Partner</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
