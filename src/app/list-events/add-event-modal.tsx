import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import {useEffect, useState} from "react";
import { Event as NewEvent } from "../model";
import axios from "@/app/utils/axios-instance";
import {useRouter} from "next/navigation";

export default function AddEventModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter()

  useEffect(() => {
    if (window !== undefined) {
      const userId = localStorage.getItem("user_id");
      if (userId !== null) {
        setHost( userId);
      } else {
        router.push("/login");
      }
    }
  }, []);

  const [host, setHost] = useState<string>("");


  const [event, setEvent] = useState<NewEvent>({
    id: "",
    startTime: moment.utc(),
    endTime: moment.utc(),
    name: "",
    numberOfPeople: 0,
    host,
    attendee: [],
  });

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Modal open={open} onClose={onClose}>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white p-4 flex flex-col">
            <div className="flex flex-col gap-4">
              <div className="font-semibold text-xl">Add New Event</div>
              <TextField
                label="Event Name"
                value={event.name}
                onChange={(e) => setEvent({ ...event, name: e.target.value })}
              />
              <TextField
                id="filled-number"
                label="Number of People"
                type="number"
                value={event.numberOfPeople}
                onChange={(e) =>
                  setEvent({ ...event, numberOfPeople: +e.target.value })
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
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
                <Button onClick = {() => {
                  onClose();
                }}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    axios.post("/events/", {
                      name: event.name,
                      start_time: event.startTime.toISOString(),
                      end_time: event.endTime.toISOString(),
                      max_attendees: event.numberOfPeople,
                      host: host,
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
