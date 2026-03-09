import Hero from "@/components/Hero";
import Link from "next/link";
import styles from "./page.module.css";

const categories = [
  { name: 'Luxury', image: 'https://images.unsplash.com/photo-1563720225384-9c0f129715cb?auto=format&fit=crop&q=80&w=800' },
  { name: 'SUV', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107a112?auto=format&fit=crop&q=80&w=800' },
  { name: 'Economy', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800' },
  { name: 'Sport', image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7730e6?auto=format&fit=crop&q=80&w=800' },
  { name: 'Electric', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800' }
];

export default function Home() {
  return (
    <main>
      <Hero />
      <section className="container" style={{ padding: '8rem 0' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>
          Explore Our <span style={{ color: 'var(--accent)' }}>Top Categories</span>
        </h2>
        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <Link href={`/cars?category=${cat.name}`} key={cat.name} className={styles.categoryCard}>
              <div className={styles.categoryImage} style={{ backgroundImage: `url(${cat.image})` }}></div>
              <div className={styles.categoryOverlay}>
                <h3>{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
