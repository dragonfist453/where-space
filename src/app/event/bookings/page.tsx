"use client";

import Link from "next/link";
import {
  Box,
  Collapse,
  IconButton,
  Modal,
  Pagination,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useEffect, useState } from "react";
// import AddEventModal from "./add-event-modal";
import { Booking, User } from "@/app/model";
import moment from "moment";
import axios from "@/app/utils/axios-instance";
import GroupsIcon from "@mui/icons-material/Groups";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Space } from "@/app/model";
import { space } from "postcss/lib/list";

const me = "666b32f2-4005-48cf-be54-7c3964f9978f";

export default function ListEvents() {
  const [bookingList, setBookingList] = useState<Booking[]>([]);

  useEffect(() => {
    axios
      .get(`bookings/`)
      .then(function (response) {
        const resEventList: Booking[] = [];
        response.data.map((booking: any) => {
          resEventList.push({
            id: booking.id,
            startTime: moment(booking.start_time),
            endTime: moment(booking.end_time),
            space: booking.space_details,
          });
        });
        setBookingList(resEventList);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col gap-6">
        <div className="font-bold text-3xl">Upcoming Bookings</div>
        <div className="flex flex-row gap-4 pb-6">
          <button className="bg-blue-500 text-white font-bold p-2 rounded-full shadow-md">
            Upcoming Bookings
          </button>
          <button className="bg-blue-500 text-white font-bold p-2 rounded-full shadow-md">
            Next 7 Days
          </button>
          <button className="bg-blue-500 text-white font-bold p-2 rounded-full shadow-md">
            Next 30 Days
          </button>
        </div>
        {bookingList.map((booking: Booking) => {
          return (
            <div
              className="bg-white shadow-md hover:shadow-lg flex flex-row"
              key={"Booking Details " + booking.space.name}
            >
              <div className="bg-blue-500 flex flex-col text-white content-center align-middle justify-center w-32 min-h-32 font-semibold">
                <div className="text-3xl text-center">
                  {booking.startTime.format("D")}
                </div>
                <div className="text-xl text-center">
                  {booking.startTime.format("MMMM")}
                </div>
              </div>
              <div className="flex flex-col px-4 pt-4 pb-1 w-96 justify-between">
                <div>
                  <div className="flex flex-row justify-between w-full">
                    <div className="font-semibold">{booking.space.name}</div>
                  </div>
                </div>
                <div>
                    <div>
                        <div>{booking.startTime.format("HH:mm")}</div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>{booking.endTime.format("HH:mm")}</div>
                    </div>
                </div>
                <div></div>
                <Collapse orientation="vertical">
                  <div className="ml-6 flex flex-row justify-between">
                    <div className="flex flex-col gap-1"></div>
                  </div>
                </Collapse>
              </div>
            </div>
          );
        })}
      </div>
      <Pagination count={1} />
    </main>
  );
}
