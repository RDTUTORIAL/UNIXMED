"use client"
import { useState } from 'react';

export default function Home() {
  const [locations, setLocations] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState(10); // Default radius 10 km

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position: any) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  };

  const fetchLocations = async () => {
    if (!latitude || !longitude || !radius) return;
    
    const res = await fetch(`/api/test?lat=${latitude}&lng=${longitude}&max_distance=${radius}`);
    const data = await res.json();
    setLocations(data);
  };

  return (
    <div>
      <h1>Find Nearby Locations</h1>
      <button onClick={getLocation}>Get My Location</button>
      <div>
        <label>Radius (km): </label>
        <input type="number" value={radius} onChange={(e: any) => setRadius(e.target.value)} />
      </div>
      <button onClick={fetchLocations}>Find Nearby Locations</button>

      <h2>Locations:</h2>
      <ul>
        {locations.map((location: any) => (
          <li key={location.id}>
            {location.name} - {(location.distance).toFixed(2)} km away
          </li>
        ))}
      </ul>
    </div>
  );
}
