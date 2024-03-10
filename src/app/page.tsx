"use client";

import { useState, useEffect } from 'react';
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import ResponsiveAppBar from '@/component/AppBar';
import SearchBar from '@/component/SearchBar'


export default function Home() {
  let apiKey = process.env.NEXT_PUBLIC_GMAPS_API_KEY || ""
  var [mapCentre, setMapCentre] = useState({lat: 22.54992, lng: 0})

  useEffect(() => {
    handleSendData();
  }, []);


  const handleSendData = async () => {
    
    navigator.geolocation.getCurrentPosition((position) => {
      try {
        // const response = await postData(url, data);
        console.log('Response:', position);
        // Handle the response data as needed
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude,longitude)
        setMapCentre({lng: longitude, lat: latitude })
        
      } catch (error) {
        console.error('Error:', error);
      }
    })
  };

  return (
    <div>
      <ResponsiveAppBar />
      <SearchBar/>
      <APIProvider apiKey={apiKey}>
        <div style={{height:"100vh", width:"100vw"}}>
        <Map center={mapCentre} defaultZoom={17} gestureHandling={'greedy'} disableDefaultUI={true}>
          <Marker position={mapCentre}/>
        </Map>
        </div>

      </APIProvider>
    </div>
  );
}