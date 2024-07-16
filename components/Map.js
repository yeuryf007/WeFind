'use client';
import {
    GoogleMap,
    useLoadScript
  } from "@react-google-maps/api";
  
  const Map = () => {
  
    const { isLoaded } = useLoadScript({
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    });
  
    if (!isLoaded) return <div>Loading....</div>;

    // get current location
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const currentLocation = { lat: latitude, lng: longitude };
            // do something with currentLocation
            console.log("Current Location:", currentLocation);
          },
          (error) => {
            console.error("Error getting current location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    // call getCurrentLocation to get the current location
    getCurrentLocation();
  
<<<<<<< HEAD
    const center = { lat: 'YOUR-LATITUDE', lng: 'YOUR-LONGITUDE' };
=======
    // static lat and lng
    const center = { lat: 18.4649639, lng: -69.9479573 };
>>>>>>> 4b6be6ec617ea5288efa4903e2ae80228cecb055
  
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
  
        {/* map component  */}
        <useLoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              zoom={12}
              center={getCurrentLocation()|| center}
              mapContainerClassName="map"
              mapContainerStyle={{ width: "500px", height: "400px", margin: "10px" }}
            >
            </GoogleMap>
        </useLoadScript>
      </div>
    );
  };
  
  export default Map;