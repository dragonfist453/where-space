"use client";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Card,
  Checkbox,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  TextField,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import { ChatMessage, User, Event as CurrentEvent, } from "../model";
import ResponsiveAppBar from "@/components/AppBar";
import axios from "axios";
import useWebSocket, { ReadyState } from "react-use-websocket";
import React from "react";

const me = "666b32f2-4005-48cf-be54-7c3964f9978f";

export default function EventPage() {
  const id = window.location.hash.slice(1);

  const [currentEvent, setCurrentEvent] = useState<CurrentEvent>({
    id: "",
    name: "",
    numberOfPeople: -1,
    startTime: moment().utc(),
    endTime: moment().utc(),
    host: "",
    attendee: [],
  });

  useEffect(() => {
    axios
      .get(`http://10.242.109.78:8000/events/${id}`)
      .then(function ({ data }) {
        const resAttendee: User[] = [];
        data.attendees.map((attendee: any) => {
          resAttendee.push({
            email: attendee.email,
            firstName: attendee.first_name,
            id: attendee.id,
            username: attendee.username,
            lastName: attendee.last_name,
            interests: attendee.interests,
          });
        });
        setCurrentEvent({
          id: data.id,
          name: data.name,
          numberOfPeople: data.max_attendees,
          startTime: moment(data.start_time),
          endTime: moment(data.end_time),
          host: data.host,
          attendee: resAttendee,
        });
      });
  }, []);

  return (
    <>
    <ResponsiveAppBar />
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="grid grid-cols-4 w-full">
        <div className="h-screen flex flex-col  w-full">
          <PeopleSection people={currentEvent.attendee} />
          <div className="font-bold text-3xl h-1/2 p-8">Summary</div>
        </div>
        <Paper className="col-span-2 w-full px-12">
          <ChatSection id={id} people={currentEvent.attendee} />
        </Paper>
        <div className="h-screen w-full">
          <TaskSection />
          <div className="font-bold text-3xl h-1/3 p-8">What We Do</div>
        </div>
      </div>
    </main>
    </>
  );
}

function TaskSection() {
  return (
    <div className="flex flex-col h-2/3 p-8 gap-4">
      <div className="font-bold text-3xl ">Task List</div>
      <TaskCard text="Review Problem Sheet" />
      <TaskCard text="Watch Recording" />
    </div>
  );
}

function TaskCard({ text }: { text: string }) {
  return (
    <Card variant="outlined">
      <Checkbox />
      {text}
    </Card>
  );
}

function PeopleSection({ people }: { people: User[] }) {
  return (
    <div className="h-1/2 p-8 flex flex-col gap-4">
      <div className="font-bold text-3xl">People</div>
      {people.map((user, index) => {
        return (
          <React.Fragment key={index}>
            <div className="flex flex-row gap-4">
              <AccountCircleIcon />
              {user.firstName} {user.lastName}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ChatSection({ id, people }: { id: string; people: User[] }) {
  const WS_URL = `ws://10.242.109.78:8000/ws/event_room/${id}/?user_id=${me}`;
  const {
    sendJsonMessage,
    lastJsonMessage,
    sendMessage,
    readyState,
  }: {
    sendJsonMessage: any;
    lastJsonMessage: any;
    sendMessage: any;
    readyState: any;
  } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
  });
  const [messageList, setMessageList] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (lastJsonMessage != null && lastJsonMessage.text) {
      setMessageList([
        ...messageList,
        {
          from: lastJsonMessage.sender,
          content: lastJsonMessage.text,
          time: moment(lastJsonMessage.created_at),
        },
      ]);
    }
  }, [lastJsonMessage]);

  const [inputContent, setInputContent] = useState<string>("");

  const send = () => {
    sendJsonMessage({ message: inputContent, user_id: me });
    setInputContent("");
  };
  return (
    <div className="flex flex-col justify-end h-screen py-8">
      <div className="flex flex-col gap-2 text-xl mb-2">
        {messageList.map((message) => {
          if (message.from === "Me") {
            return (
              <span className="flex w-full justify-start items-center">
                Me: {message.content}
                <AccountCircleIcon />
              </span>
            );
          }

          return (
            <span
              className="flex w-full justify-start items-center"
              key={"Incoming " + message.content}
            >
              <AccountCircleIcon />
              {people.find((one) => one.id === message.from)?.firstName}:{" "}
              {message.content}
            </span>
          );
        })}
      </div>
      <OutlinedInput
        value={inputContent}
        onChange={(e) => setInputContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            send();
          }
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton edge="end" onClick={() => send()}>
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </div>
  );
}
