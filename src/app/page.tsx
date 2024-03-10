"use client";

import { useState, useEffect } from "react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import ResponsiveAppBar from "@/components/AppBar";
import SearchBar from "@/components/SearchBar";
import { Space, SpaceType } from "./model";
import axios from "@/app/utils/axios-instance";
import { exampleLocations } from "@/example-data/exampleLocations";
import { AxiosResponse } from "axios";
import { Badge, Chip } from "@mui/material";
import { PinDrop, Place } from "@mui/icons-material";

export default function Home() {
  const [locations, setLocations] = useState<Space[]>([]);
  const [center, setCenter] = useState({ lat: 51.5007292, lng: -0.1246254 });
  const [zoom, setZoom] = useState(14);
  const [bounds, setBounds] = useState({
    east: 180,
    north: 90,
    south: -90,
    west: -180,
  });

  useEffect(() => {
    axios
      .get(
        `spaces/?boundingbox=${bounds.west},${bounds.east},${bounds.south},${bounds.north}`
      )
      .then((response: AxiosResponse) => {
        const responseLocations = response.data;
        const locations: Space[] = responseLocations.map(
          (location: {
            name: string;
            description: string;
            image_url: string;
            google_map_url: string;
            rate: number;
            type: string;
            latitude: number;
            longitude: number;
            id: string;
          }) => {
            return {
              name: location.name,
              description: location.description,
              imageUrl: location.image_url,
              locationUrl: location.google_map_url,
              rating: location.rate,
              type: location.type as SpaceType,
              latitude: location.latitude,
              longitude: location.longitude,
              usersCurrent: Number(Math.random() * 2 + 5).toFixed(0),
            };
          }
        );
        setLocations(locations);
      })
      .catch((error) => {
        console.error(error);
        setLocations(exampleLocations);
      });
  }, [bounds]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      try {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setCenter({ lng: longitude, lat: latitude });
      } catch (error) {
        console.error("Error:", error);
      }
    });
  }, []);

  return (
    <div>
      <ResponsiveAppBar />
      <SearchBar
        locations={locations}
        onElementClick={(location: Space) => {
          setCenter({ lat: location.latitude, lng: location.longitude });
          setZoom(17);
        }}
      />
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GMAPS_API_KEY || ""}>
        <div style={{ height: "94vh", width: "100vw" }}>
          <Map
            center={center}
            zoom={zoom}
            mapId={"home-map"}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            onCameraChanged={(cameraEvent) => {
              setCenter({
                lat: cameraEvent.detail.center.lat,
                lng: cameraEvent.detail.center.lng,
              });
              setZoom(cameraEvent.detail.zoom);
              setBounds(cameraEvent.detail.bounds);
            }}
          >
            {locations.map((location, index) => (
              <AdvancedMarker
                key={index}
                position={{
                  lat: location.latitude,
                  lng: location.longitude,
                }}
              >
                <Badge badgeContent={location.usersCurrent} color="success">
                  <Place color="error" style={{ scale: 2 }} />
                </Badge>
              </AdvancedMarker>
            ))}
          </Map>
        </div>
      </APIProvider>
    </div>
  );
}
