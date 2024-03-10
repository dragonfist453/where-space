import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import { SpaceType } from "@/app/model";

export default function SpaceTypeSelect() {
  const [spaceType, setSpaceType] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSpaceType(event.target.value as string);
  };

  return (
    <Box sx={{ width: "200px" }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Space Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={spaceType}
          label="Space Type"
          onChange={handleChange}
        >
          {Object.keys(SpaceType).map((type) => {
            return (
              <MenuItem value={type} key={type}>
                {type}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
