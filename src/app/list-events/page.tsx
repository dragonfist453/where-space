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
import AddEventModal from "./add-event-modal";
import { Event as CreatedEvent, User } from "../model";
import moment from "moment";
import axios from "@/app/utils/axios-instance";
import GroupsIcon from "@mui/icons-material/Groups";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ResponsiveAppBar from "@/components/AppBar";
import { useRouter } from "next/navigation";
import React from "react";

const me = "666b32f2-4005-48cf-be54-7c3964f9978f";

export default function ListEvents() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [eventList, setEventList] = useState<CreatedEvent[]>([]);

  useEffect(() => {
    axios
      .get("events/")
      .then(function (response) {
        const resEventList: CreatedEvent[] = [];
        response.data.map((event: any) => {
          const attendees: User[] = [];
          event.attendees.map((attendee: any) => {
            attendees.push({
              id: attendee.id,
              username: attendee.username,
              email: attendee.email,
              firstName: attendee.first_name,
              lastName: attendee.last_name,
              interests: attendee.attendee,
            });
          });
          resEventList.push({
            id: event.id,
            startTime: moment(event.start_time),
            endTime: moment(event.end_time),
            name: event.name,
            numberOfPeople: event.max_attendees,
            host: event.host,
            attendee: attendees,
            showAttendee: false,
          });
        });
        setEventList(resEventList);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const router = useRouter();

  return (
    <>
      <ResponsiveAppBar />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <AddEventModal open={openModal} onClose={() => setOpenModal(false)} />
        <div className="flex flex-col gap-6">
          <div className="font-bold text-3xl">Upcoming Events</div>
          <div className="flex flex-row gap-4 pb-6">
            <button className="bg-blue-500 text-white font-bold p-2 rounded-full shadow-md">
              All Events
            </button>
            <button className="bg-blue-500 text-white font-bold p-2 rounded-full shadow-md">
              Next 7 Days
            </button>
            <button className="bg-blue-500 text-white font-bold p-2 rounded-full shadow-md">
              Next 30 Days
            </button>
          </div>
          {eventList.map((event: CreatedEvent, index) => {
            var meInEvent = false;
            return (
              <React.Fragment key={index}>
                <div
                  onClick={() => router.push(`/event#${event.id}`)}
                  className="bg-white shadow-md hover:shadow-lg flex flex-row"
                  key={"Event Details " + event.name}
                >
                  <div className="bg-blue-500 flex flex-col text-white content-center align-middle justify-center w-32 min-h-32 font-semibold">
                    <div className="text-3xl text-center">
                      {event.startTime.format("D")}
                    </div>
                    <div className="text-xl text-center">
                      {event.startTime.format("MMMM")}
                    </div>
                    <div className="text-md text-center">
                      {event.startTime.format("HH:MM")}
                    </div>
                  </div>
                  <div className="flex flex-col px-4 pt-4 pb-1 w-96 justify-between">
                    <div>
                      <div className="flex flex-row justify-between w-full">
                        <div className="font-semibold">{event.name}</div>
                        {event.host == me && (
                          <GroupsIcon className="fill-yellow-400" />
                        )}
                      </div>
                      <div className="text-xl text-center">
                        {event.startTime.format("MMMM")}
                      </div>
                    </div>
                    <div className="flex flex-col px-4 pt-4 pb-1 w-96 justify-between">
                      <div>
                        {event.booking
                          ? event.booking.space.name
                          : "No Booking Yet"}
                      </div>
                      <div className="text-sm italic text-gray-700">
                        Duration: {event.endTime.diff(event.startTime, "hours")}{" "}
                        hours
                      </div>
                    </div>
                    <div
                      className="flex flex-row items-center justify-between gap-1 w-full"
                      onClick={() =>
                        setEventList((prevEvents) =>
                          prevEvents.map((prevEvent) =>
                            prevEvent.id === event.id
                              ? {
                                  ...prevEvent,
                                  showAttendee: !event.showAttendee,
                                }
                              : prevEvent
                          )
                        )
                      }
                    >
                      <div className="flex">
                        <PersonIcon />
                        <div className=""> max {event.numberOfPeople}</div>
                      </div>
                      <button className="p-0.5 self-end rounded-full">
                        {event.showAttendee ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </button>
                    </div>
                    <Collapse orientation="vertical" in={event.showAttendee}>
                      <div className="ml-6 flex flex-row justify-between">
                        <div className="flex flex-col gap-1">
                          {event.attendee.length === 0 && (
                            <div className="">No Attendee</div>
                          )}
                          {event.attendee.map((attendee: User, index) => {
                            if (attendee.id === me) meInEvent = true;
                            return (
                              <React.Fragment key={index}>
                                <div
                                  className="flex gap-1"
                                  key={
                                    "AccountCircle " +
                                    "Event " +
                                    event.name +
                                    " Attendee " +
                                    attendee.id
                                  }
                                >
                                  <AccountCircleIcon />
                                  {attendee.firstName} {attendee.lastName}
                                </div>
                              </React.Fragment>
                            );
                          })}
                          {meInEvent ? (
                            <>Joined</>
                          ) : (
                            event.attendee.length !== event.numberOfPeople && (
                              <div className="flex">
                                <IconButton
                                  className="p-0 mr-1"
                                  onClick={() => {
                                    axios
                                      .post(`events/${event.id}/attend/`, {
                                        user: me,
                                      })
                                      .then(() => {
                                        const meUser: User = {
                                          id: me,
                                          username: "Owen",
                                          email: "",
                                          firstName: "",
                                          lastName: "",
                                          interests: [],
                                        };
                                        setEventList((prevEvents) =>
                                          prevEvents.map((prevEvent) =>
                                            prevEvent.id === event.id
                                              ? {
                                                  ...prevEvent,
                                                  attendee: [
                                                    ...event.attendee,
                                                    meUser,
                                                  ],
                                                }
                                              : prevEvent
                                          )
                                        );
                                      });
                                  }}
                                >
                                  <AddCircleOutlineIcon />
                                </IconButton>
                                Join
                              </div>
                            )
                          )}
                        </div>

                        <div>
                          {event.booking
                            ? event.booking.space.name
                            : "No Booking Yet"}
                        </div>
                      </div>
                    </Collapse>
                    <div
                      className="flex flex-row items-center justify-between gap-1 w-full"
                      onClick={() =>
                        setEventList((prevEvents) =>
                          prevEvents.map((prevEvent) =>
                            prevEvent.id === event.id
                              ? {
                                  ...prevEvent,
                                  showAttendee: !event.showAttendee,
                                }
                              : prevEvent
                          )
                        )
                      }
                    >
                      <div className="flex">
                        <PersonIcon />
                        <div className=""> max {event.numberOfPeople}</div>
                      </div>
                      <button className="p-0.5 self-end rounded-full">
                        {event.showAttendee ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </button>
                    </div>
                    <Collapse orientation="vertical" in={event.showAttendee}>
                      <div className="ml-6 flex flex-row justify-between">
                        <div className="flex flex-col gap-1">
                          {event.attendee.length === 0 && (
                            <div className="">No Attendee</div>
                          )}
                          {event.attendee.map((attendee: User) => {
                            if (attendee.id === me) meInEvent = true;
                            return (
                              <div
                                className="flex gap-1"
                                key={
                                  "AccountCircle " +
                                  "Event " +
                                  event.name +
                                  " Attendee " +
                                  attendee.id
                                }
                              >
                                <AccountCircleIcon />
                                {attendee.username}
                              </div>
                            );
                          })}
                          {meInEvent ? (
                            <>Joined</>
                          ) : (
                            event.attendee.length !== event.numberOfPeople && (
                              <div className="flex">
                                <IconButton
                                  className="p-0 mr-1"
                                  onClick={() => {}}
                                >
                                  <AddCircleOutlineIcon />
                                </IconButton>
                                Join
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </Collapse>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div className="fixed bottom-16 right-16">
          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg"
          >
            Add Event
          </button>
        </div>
        <Pagination count={1} />
      </main>
    </>
  );
}
