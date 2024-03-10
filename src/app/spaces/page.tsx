"use client";

import SpaceItemCard from "@/components/SpaceItemCard";
import { Space, SpaceType } from "@/app/model";
import { Divider, Grid } from "@mui/material";
import { APIProvider, AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import SpaceTypeSelect from "./SpaceTypeSelect";
import { useEffect, useState } from "react";
import axios from "@/app/utils/axios-instance";
import { AxiosResponse } from "axios";
import { exampleLocations } from "@/example-data/exampleLocations";
import ResponsiveAppBar from "@/components/AppBar";

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
  const [spaceType, setSpaceType] = useState("");

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
              id: location.id,
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
        if (spaceType !== "") {
          setLocations(
            locations.filter(
              (location) => location.type === spaceType.toLocaleUpperCase()
            )
          );
        } else {
          setLocations(locations);
        }
      })
      .catch((error) => {
        console.error(error);
        setLocations(exampleLocations);
      });
  }, [bounds, spaceType]);

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
    <>
      <ResponsiveAppBar />
      <div style={{ height: "94vh", width: "100vw", overflow: "hidden" }}>
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
              <SpaceTypeSelect
                spaceType={spaceType}
                setSpaceType={setSpaceType}
              />
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
    </>
  );
}
