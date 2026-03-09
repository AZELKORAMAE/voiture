'use client';

import { useState } from 'react';
import styles from './AddCarModal.module.css';

const AddCarModal = ({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) => {
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        category: 'SUV',
        pricePerDay: 0,
        specs: {
            transmission: 'Automatic',
            fuelType: 'Petrol',
            seats: 5,
            power: '',
            maxSpeed: '',
            color: '',
            insuranceType: 'Basic Coverage'
        },
        visibleFields: ['transmission', 'fuelType', 'seats', 'power', 'maxSpeed', 'color', 'insuranceType'],
        features: []
    });
    const [loading, setLoading] = useState(false);

    const handleVisibilityToggle = (field: string) => {
        setFormData(prev => {
            const isVisible = prev.visibleFields.includes(field);
            return {
                ...prev,
                visibleFields: isVisible
                    ? prev.visibleFields.filter(f => f !== field)
                    : [...prev.visibleFields, field]
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/agency/cars', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Failed to add car');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Add New <span>Car</span></h2>
                    <button onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label>Make</label>
                            <input type="text" required value={formData.make} onChange={e => setFormData({ ...formData, make: e.target.value })} placeholder="e.g. BMW" />
                        </div>
                        <div className={styles.group}>
                            <label>Model</label>
                            <input type="text" required value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} placeholder="e.g. X5" />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label>Year</label>
                            <input type="number" value={formData.year} onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })} />
                        </div>
                        <div className={styles.group}>
                            <label>Category</label>
                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                <option value="Luxury">Luxury</option>
                                <option value="SUV">SUV</option>
                                <option value="Economy">Economy</option>
                                <option value="Sport">Sport</option>
                                <option value="Electric">Electric</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label>Price Per Day ($)</label>
                            <input type="number" required value={formData.pricePerDay} onChange={e => setFormData({ ...formData, pricePerDay: parseFloat(e.target.value) })} />
                        </div>
                        <div className={styles.group}>
                            <label>Transmission</label>
                            <select value={formData.specs.transmission} onChange={e => setFormData({ ...formData, specs: { ...formData.specs, transmission: e.target.value } })}>
                                <option value="Automatic">Automatic</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label>Fuel Type</label>
                            <select value={formData.specs.fuelType} onChange={e => setFormData({ ...formData, specs: { ...formData.specs, fuelType: e.target.value } })}>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label>Seats</label>
                            <input type="number" value={formData.specs.seats} onChange={e => setFormData({ ...formData, specs: { ...formData.specs, seats: parseInt(e.target.value) } })} />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label>Color</label>
                            <input type="text" value={formData.specs.color} onChange={e => setFormData({ ...formData, specs: { ...formData.specs, color: e.target.value } })} placeholder="e.g. Black" />
                        </div>
                        <div className={styles.group}>
                            <label>Max Speed (Optionnel, ex: 250 km/h)</label>
                            <input type="text" value={formData.specs.maxSpeed} onChange={e => setFormData({ ...formData, specs: { ...formData.specs, maxSpeed: e.target.value } })} placeholder="e.g. 250 km/h" />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.group} style={{ flex: 1 }}>
                            <label>Insurance Type</label>
                            <select value={formData.specs.insuranceType} onChange={e => setFormData({ ...formData, specs: { ...formData.specs, insuranceType: e.target.value } })}>
                                <option value="Basic Coverage">Basic Coverage</option>
                                <option value="Full Coverage">Full Coverage (+ Premium)</option>
                                <option value="Third-Party Only">Third-Party Only</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.visibilitySection} style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--foreground)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                        <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Select Fields to Display Publicly</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem' }}>
                            {['transmission', 'fuelType', 'seats', 'color', 'maxSpeed', 'insuranceType'].map(field => (
                                <label key={field} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.visibleFields.includes(field)}
                                        onChange={() => handleVisibilityToggle(field)}
                                    />
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Car to Inventory'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCarModal;
