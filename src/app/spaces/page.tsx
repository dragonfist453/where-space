"use client";

import SpaceItemCard from "@/components/SpaceItemCard";
import { Space, SpaceType } from "@/model/Space";
import { Divider, Grid } from "@mui/material";
import { APIProvider, AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import SpaceTypeSelect from "./SpaceTypeSelect";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

const exampleLocations: Space[] = [
  {
    name: "Location 1",
    description: "Description 1",
    rating: 4.5,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: SpaceType.Silent,
    latitude: 51.501,
    longitude: -0.124,
  },
  {
    name: "Location 2",
    description: "Description 2",
    rating: 3.8,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: SpaceType.Busy,
    latitude: 51.5,
    longitude: -0.124,
  },
  {
    name: "Location 3",
    description: "Description 2",
    rating: 3.8,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: SpaceType.Meeting,
    latitude: 51.5,
    longitude: -0.125,
  },
  {
    name: "Location 4",
    description: "Description 2",
    rating: 3.8,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: SpaceType.Meeting,
    latitude: 51.501,
    longitude: -0.123,
  },
  {
    name: "Location 5",
    description: "Description 5",
    rating: 4.2,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: SpaceType.Silent,
    latitude: 51.5,
    longitude: -0.127,
  },
  {
    name: "Location 6",
    description: "Description 6",
    rating: 3.9,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: SpaceType.Busy,
    latitude: 51.5,
    longitude: -0.129,
  },
  {
    name: "Location 7",
    description: "Description 7",
    rating: 4.1,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: SpaceType.Meeting,
    latitude: 51.501,
    longitude: -0.12,
  },
  {
    name: "Location 8",
    description: "Description 8",
    rating: 4.3,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: SpaceType.Meeting,
    latitude: 51.504,
    longitude: -0.122,
  },
  {
    name: "Location 9",
    description: "Description 9",
    rating: 3.7,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: SpaceType.Silent,
    latitude: 51.502,
    longitude: -0.1246258,
  },
  {
    name: "Location 10",
    description: "Description 10",
    rating: 4.0,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: SpaceType.Busy,
    latitude: 51.499,
    longitude: -0.128,
  },
];

export default function Spaces() {
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
    const hostname = process.env.NEXT_PUBLIC_API_HOSTNAME;
    axios
      .get(
        `${hostname}spaces/?boundingbox=${bounds.west},${bounds.east},${bounds.south},${bounds.north}`
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
            };
          }
        );
        console.log(locations);
        setLocations(locations);
      });
  }, [bounds]);
  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={4}
          height="100vh"
          style={{
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <Divider
            orientation="horizontal"
            style={{ paddingTop: "10px", paddingBottom: "10px" }}
          />
          <div style={{ margin: "auto", width: "95%" }}>
            <SpaceTypeSelect />
          </div>
          <Divider
            orientation="horizontal"
            style={{ paddingTop: "10px", paddingBottom: "10px" }}
          />
          <Grid container>
            {locations.map((location, index) => (
              <Grid item xs={12} key={index}>
                <SpaceItemCard location={location} index={index} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={8} height="100vh">
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GMAPS_API_KEY || ""}>
            <Map
              center={center}
              zoom={zoom}
              mapId={"spaces-map"}
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
                />
              ))}
            </Map>
          </APIProvider>
        </Grid>
      </Grid>
    </div>
  );
}
