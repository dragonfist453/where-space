import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { Box, Icon, InputBase, Paper } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function FreeSolo() {
  return (
    <Paper
      elevation={3}
      style={{
        position: "absolute",
        left: "30px",
        top: "90px",
        width: "300px",
        zIndex: 10,
        padding: "2px 2px",
      }}
    >
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={exampleLocations.map((option) => option.name)}
        renderInput={(params) => (
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Icon sx={{ height: "40px", width: "40px" }}>
              <Search />
            </Icon>
            <InputBase
              style={{
                height: "40px",
              }}
              {...params}
              placeholder="Where should I study?"
              inputProps={{
                ...params.InputProps,
                type: "search",
              }}
            ></InputBase>
          </Box>
        )}
      />
    </Paper>
  );
}

const exampleLocations = [
  {
    name: "Location 1",
    description: "Description 1",
    rating: 4.5,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: "Silent",
    latitude: 51.501,
    longitude: -0.124,
  },
  {
    name: "Location 2",
    description: "Description 2",
    rating: 3.8,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: "Busy",
    latitude: 51.5,
    longitude: -0.124,
  },
  {
    name: "Location 3",
    description: "Description 2",
    rating: 3.8,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: "Meeting",
    latitude: 51.5,
    longitude: -0.125,
  },
  {
    name: "Location 4",
    description: "Description 2",
    rating: 3.8,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: "Meeting",
    latitude: 51.501,
    longitude: -0.123,
  },
  {
    name: "Location 5",
    description: "Description 5",
    rating: 4.2,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: "Silent",
    latitude: 51.5,
    longitude: -0.127,
  },
  {
    name: "Location 6",
    description: "Description 6",
    rating: 3.9,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: "Busy",
    latitude: 51.5,
    longitude: -0.129,
  },
  {
    name: "Location 7",
    description: "Description 7",
    rating: 4.1,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: "Meeting",
    latitude: 51.501,
    longitude: -0.12,
  },
  {
    name: "Location 8",
    description: "Description 8",
    rating: 4.3,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: "Meeting",
    latitude: 51.504,
    longitude: -0.122,
  },
  {
    name: "Location 9",
    description: "Description 9",
    rating: 3.7,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: "Silent",
    latitude: 51.502,
    longitude: -0.1246258,
  },
  {
    name: "Location 10",
    description: "Description 10",
    rating: 4.0,
    imageUrl: "https://via.placeholder.com/200",
    locationUrl: "https://maps.app.goo.gl/h4KpYeuaeE8ERRyj9",
    type: "Busy",
    latitude: 51.499,
    longitude: -0.128,
  },
];
