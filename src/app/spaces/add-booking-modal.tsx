import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useState } from "react";
import { Booking as NewBooking, Space } from "../model";
import axios from "@/app/utils/axios-instance";

export default function AddBookingModal({
  open,
  space,
  onClose,
}: {
  open: boolean;
  space: Space;
  onClose: () => void;
}) {
  const [event, setEvent] = useState<NewBooking>({
    id: "",
    space,
    startTime: moment.utc(),
    endTime: moment.utc(),
  });

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Modal open={open} onClose={onClose}>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white p-4 flex flex-col">
            <div className="flex flex-col gap-4">
              <div className="font-semibold text-xl">Add New Booking</div>
              <TextField label="Space Name" value={space.name} />
              <DateTimePicker
                label="Start Time"
                value={event.startTime}
                onChange={(value) => setEvent({ ...event, startTime: value!! })}
              />
              <DateTimePicker
                label="End Time"
                value={event.endTime}
                onChange={(value) => setEvent({ ...event, endTime: value!! })}
              />
              <div>
                <Button
                  onClick={() => {
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    axios
                      .post("http://10.242.109.78:8000/bookings/", {
                        space: space.id,
                        start_time: event.startTime.toISOString(),
                        end_time: event.endTime.toISOString(),
                        host: "666b32f2-4005-48cf-be54-7c3964f9978f",
                      })
                      .then(() => {
                        onClose();
                      });
                  }}
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </LocalizationProvider>
  );
}
