import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { Box, Icon, InputBase, Paper } from "@mui/material";
import { Search } from "@mui/icons-material";
import { Space } from "@/app/model";

export default function FreeSolo({ locations }: { locations: Space[] }) {
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
      <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
        <Icon sx={{ height: "40px", width: "40px" }}>
          <Search />
        </Icon>
        <Autocomplete
          freeSolo
          id="autocomplete-for-search"
          disableClearable
          options={locations.map((option) => option.name)}
          renderInput={(params) => (
            <InputBase
              style={{
                height: "40px",
              }}
              placeholder="Where should I study?"
              startAdornment={params.InputProps.startAdornment}
              endAdornment={params.InputProps.endAdornment}
              ref={params.InputProps.ref}
              inputProps={params.inputProps}
            />
          )}
        />
      </Box>
    </Paper>
  );
}
