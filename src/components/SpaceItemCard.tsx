import { Space } from "@/app/model";
import {
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
  IconButton,
  CardActions,
  CardHeader,
  Chip,
} from "@mui/material";

import PlaceIcon from "@mui/icons-material/Place";
import { useState } from "react";
import AddBookingModal from "@/app/spaces/add-booking-modal";

const SpaceItemCard = ({
  location,
  index,
}: {
  location: Space;
  index: number;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      key={index}
      style={{
        width: "90%",
        margin: "auto",
        marginBottom: "20px",
      }}
      elevation={3}
    >
      <AddBookingModal
        open={expanded}
        space={location}
        onClose={() => setExpanded(false)}
      />
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <CardContent>
          <Typography variant="h5" color="text.primary">
            {location.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {location.rating} &#11088;
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {location.description}
          </Typography>
        </CardContent>
        <Box sx={{ flexGrow: 1 }} />
        <CardMedia
          component="img"
          image={location.imageUrl}
          style={{ objectFit: "cover", width: "200px", height: "200px" }}
          alt="Image of the space"
        />
      </Box>
      <CardActions>
        <IconButton
          onClick={() => window.open(location.locationUrl, "_blank")}
          aria-label="View Location"
        >
          <PlaceIcon />
        </IconButton>
        <Chip label={location.type} variant="outlined" />
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={() => setExpanded(true)} aria-label="Book Space">
          Book
        </Button>
      </CardActions>
    </Card>
  );
};

export default SpaceItemCard;
