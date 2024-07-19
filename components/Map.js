'use client';
import { useState, useEffect } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker
} from "@react-google-maps/api";

const Map = ({ onMapClick }) => {
  const [center, setCenter] = useState({ lat: 18.4649639, lng: -69.9479573 });
  const [markerPosition, setMarkerPosition] = useState(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  });

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCenter({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error("Error getting current location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };
    getCurrentLocation();
  }, []);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    onMapClick(lat, lng);
  };

  if (!isLoaded) return <div>Loading....</div>;

  return (
    <div 
      id="map_div"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        height: "350px",
        margin: "0 auto",
        marginTop: "1rem",
        marginBottom: "1rem",
      }}
    >
      <GoogleMap
        zoom={12}
        center={center}
        mapContainerClassName="map"
        mapContainerStyle={{
          width: "100%",
          height: "100%",
        }}
        onClick={handleMapClick}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </div>
  );
};

export default Map;