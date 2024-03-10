"use client";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Card,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  TextField,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import moment, { Moment } from "moment";
import {useEffect, useRef, useState} from "react";
import { ChatMessage, User, Event as CurrentEvent } from "../model";
import ResponsiveAppBar from "@/components/AppBar";
import axios from "axios";
import useWebSocket, { ReadyState } from "react-use-websocket";
import React from "react";
import { useSearchParams } from "next/navigation";

const me = "666b32f2-4005-48cf-be54-7c3964f9978f";

export default function EventPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  console.log(id);

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
      <main className="flex flex-col items-center justify-between">
        <div className="grid grid-cols-4 w-full">
          <div className="flex flex-col w-full">
            <PeopleSection people={currentEvent.attendee} />
            <Divider />
            <Paper className="font-bold text-3xl h-1/2 p-8" elevation={3}>
              Summary
              <Divider style={{ paddingTop: "10px" }} />
            </Paper>
          </div>
          <Paper className="col-span-2 w-full px-12" elevation={3}>
            <ChatSection
              id={id!!}
              people={currentEvent.attendee}
              name={currentEvent.name}
            />
          </Paper>
          <div className="w-full">
            <TaskSection />
            <Divider />
            <Paper className="font-bold text-3xl h-1/3 p-8" elevation={3}>
              What We Do
            </Paper>
          </div>
        </div>
      </main>
    </>
  );
}

function TaskSection() {
  return (
    <Paper className="flex flex-col h-2/3 p-8 gap-4" elevation={3}>
      <div className="font-bold text-3xl ">Task List</div>
      <TaskCard text="Review Problem Sheet" />
      <TaskCard text="Watch Recording" />
    </Paper>
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
    <Paper className="h-1/2 p-8 flex flex-col gap-4" elevation={3}>
      <div className="font-bold text-3xl">People</div>
      <Divider />
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
    </Paper>
  );
}

function ChatSection({
  id,
  people,
  name,
}: {
  id: string;
  people: User[];
  name: string;
}) {
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
    onMessage: (event: MessageEvent) => {
      const obj = JSON.parse(event.data);
      if (obj.messages !== undefined) {
        setMessageList(obj.messages.map((message: any) => {
          return {
            id: message.id,
            from: message.sender,
            content: message.text,
            time: moment(message.created_at),
          }
        }));
      } else {
        setMessageList([
          ...messageList,
          {
            id: obj.id,
            from: obj.sender,
            content: obj.text,
            time: moment(obj.created_at),
          },
        ])
      }
    },
  });
  const [messageList, setMessageList] = useState<ChatMessage[]>([]);

  const [inputContent, setInputContent] = useState<string>("");

  const send = () => {
    sendJsonMessage({ message: inputContent, user_id: me });
    setInputContent("");
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.scrollTop = element.scrollHeight - element.clientHeight;
    }
  }, [lastJsonMessage]); // You can add dependencies to this array if the action should run more than once


  return (
    <Paper
      className="flex flex-col justify-end py-8 px-4"
      elevation={8}
      style={{ height: "92.5vh" }}
    >
      <div className="flex flex-col gap-2 text-xl mb-2 overflow-y-scroll" ref={scrollRef}>
        {messageList.map((message) => {
          if (message.from === me) {
            return (
              <span className="flex w-full justify-start items-center" key={message.id}>
                Me ({message.time.format("HH:MM:SS")}): {message.content}
                <AccountCircleIcon />
              </span>
            );
          }

          return (
            <span
              className="flex w-full justify-start items-center"
              key={message.id}
            >
              <AccountCircleIcon />
              {people.find((one) => one.id === message.from)?.firstName} (
              {message.time.format("HH:MM:SS")}): {message.content}
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
    </Paper>
  );
}
