import React, { useState } from "react";

function ToggleButton() {
  // State to manage the button text and checked-in status
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Function to handle button click
  const handleClick = () => {
    setIsCheckedIn(!isCheckedIn);
    // Perform some action based on the current state
    // if (isCheckedIn) {
    //   console.log("Performing check-out actions...");
    //   // Add your check-out function or actions here
    // } else {
    //   console.log("Performing check-in actions...");
    //   // Add your check-in function or actions here
    // }
  };

  return (
    <button onClick={handleClick}>
      {isCheckedIn ? "Check-Out" : "Check-In"}
    </button>
  );
}

export default ToggleButton;
