import styles from './CarCard.module.css';
import Image from 'next/image';
import Link from 'next/link';

const CarCard = ({ car }: { car: any }) => {
    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                {car.images?.[0] ? (
                    <Image src={car.images[0]} alt={`${car.make} ${car.model}`} fill style={{ objectFit: 'cover' }} />
                ) : (
                    <div className={styles.placeholder}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                        </svg>
                    </div>
                )}
                <div className={styles.category}>{car.category}</div>
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h3>{car.make} {car.model}</h3>
                    <div className={styles.price}>
                        <span>${car.pricePerDay}</span>/day
                    </div>
                </div>

                <p className={styles.agency}>{car.agencyId?.name}</p>

                <div className={styles.specs}>
                    {(!car.visibleFields || car.visibleFields.includes('transmission')) && (
                        <div className={styles.spec}>
                            <span className={styles.icon}>⚙️</span>
                            {car.specs.transmission}
                        </div>
                    )}
                    {(!car.visibleFields || car.visibleFields.includes('fuelType')) && (
                        <div className={styles.spec}>
                            <span className={styles.icon}>⛽</span>
                            {car.specs.fuelType}
                        </div>
                    )}
                    {(!car.visibleFields || car.visibleFields.includes('seats')) && (
                        <div className={styles.spec}>
                            <span className={styles.icon}>🪑</span>
                            {car.specs.seats} Seats
                        </div>
                    )}
                </div>

                <Link href={`/cars/${car._id}`} className="btn-primary" style={{ width: '100%', textAlign: 'center', marginTop: '1rem' }}>
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default CarCard;
