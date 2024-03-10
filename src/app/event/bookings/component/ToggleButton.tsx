import { Booking } from "@/app/model";
import axios from "@/app/utils/axios-instance";
import React, { useState } from "react";

function ToggleButton({
  booking,
  setReload,
}: {
  booking: Booking;
  setReload: (reload: boolean) => void;
}) {
  // State to manage the button text and checked-in status
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Function to handle button click
  const handleClick = () => {
    setIsCheckedIn(!isCheckedIn);
    if (!isCheckedIn) {
      console.log("Performing check-out actions...");
      // Add your check-out function or actions here
    } else {
      axios.delete(`bookings/${booking.id}/`).then(function (response) {
        console.log(response);
        setReload(true);
      });
    }
  };

  return (
    <button onClick={handleClick}>
      {isCheckedIn ? "Check-Out" : "Check-In"}
    </button>
  );
}

export default ToggleButton;
