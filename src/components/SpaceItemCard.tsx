import { Space } from "@/model/Space";
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
} from "@mui/material";

import PlaceIcon from "@mui/icons-material/Place";

const SpaceItemCard = ({
  location,
  index,
}: {
  location: Space;
  index: number;
}) => {
  return (
    <Card
      key={index}
      style={{
        width: "90%",
        height: "250px",
        margin: "auto",
        marginBottom: "20px",
      }}
      elevation={3}
    >
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <CardContent>
          <Typography variant="h5" color="text.primary">
            {location.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {location.rating} stars
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
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={() => console.log("Booked!")} aria-label="Book Space">
          Book
        </Button>
      </CardActions>
    </Card>
  );
};

export default SpaceItemCard;
