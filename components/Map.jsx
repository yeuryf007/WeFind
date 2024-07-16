"use client";
import React, { useEffect } from 'react';

const Map = () => {
    useEffect(() => {
        // Código para cargar la API de Google Maps y crear el mapa aquí
        // Asegúrate de reemplazar 'YOUR_API_KEY' con tu propia clave de API de Google Maps

        const loadMap = () => {
            const script = document.createElement('script');
            const YOUR_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${YOUR_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);

            script.onload = () => {
                // Código para crear el mapa y realizar otras operaciones relacionadas con el mapa
                const map = new window.google.maps.Map(document.getElementById('map'), {
                    center: { lat: 37.7749, lng: -122.4194 },
                    zoom: 8,
                });

                // Otros códigos relacionados con el mapa aquí
            };
        };

        loadMap();
    }, []);

    return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};

export default Map;