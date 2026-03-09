'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';

// Fix typical Leaflet icon issue with Next.js/Webpack using unpkg CDN
const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function AgencyMap({ agencies }: { agencies: any[] }) {
    if (!agencies || agencies.length === 0) return null;

    // Use the first agency as the center, or a default Morocco center [31.7917, -7.0926]
    const defaultCenter: [number, number] = agencies[0]?.location?.coordinates
        ? [agencies[0].location.coordinates[1], agencies[0].location.coordinates[0]]
        : [31.7917, -7.0926];

    return (
        <div style={{ height: '400px', width: '100%', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '2rem' }}>
            <MapContainer center={defaultCenter} zoom={6} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />

                {agencies.map(agency => {
                    if (!agency.location?.coordinates) return null;
                    // MongoDB coordinates are [lng, lat], Leaflet expects [lat, lng]
                    const position: [number, number] = [agency.location.coordinates[1], agency.location.coordinates[0]];
                    return (
                        <Marker key={agency._id} position={position} icon={customIcon}>
                            <Popup>
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{agency.name}</h3>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#666' }}>{agency.address}</p>
                                    <Link href={`/cars?agency=${agency._id}`} style={{ background: 'var(--primary)', color: 'var(--background)', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'inline-block' }}>
                                        View Cars
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
