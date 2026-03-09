import Hero from "@/components/Hero";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.main}>
      <Hero />
      <section className="container" style={{ padding: '8rem 0' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>
          Explore Our <span>Top Categories</span>
        </h2>
        {/* Category filtering logic will go here */}
      </section>
    </div>
  );
}
