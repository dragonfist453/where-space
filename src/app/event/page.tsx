"use client";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Card,
  Checkbox,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import moment, { Moment } from "moment";
import { useState } from "react";
import { ChatMessage, User } from "../model";
import ResponsiveAppBar from "@/components/AppBar";

export default function EventPage() {
  return (
    <>
      <ResponsiveAppBar />
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="grid grid-cols-4 w-full">
          <div className="h-screen flex flex-col  w-full">
            <PeopleSection />
            <div className="font-bold text-3xl h-1/2 p-8">Summary</div>
          </div>
          <div className="col-span-2 w-full px-12">
            <ChatSection />
          </div>
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

function PeopleSection() {
  return (
    <div className="h-1/2 p-8 flex flex-col gap-4">
      <div className="font-bold text-3xl">People</div>
      <div className="flex flex-row gap-4">
        <AccountCircleIcon />
        John Doe
      </div>
      <div className="flex flex-row gap-4">
        <AccountCircleIcon />
        Ruozhi Da
      </div>
    </div>
  );
}

function ChatSection() {
  const me: User = {
    id: "",
    email: "me@gmail.com",
    username: "Me",
    firstName: "",
    lastName: "",
    interests: [],
  };
  const mockUser: User = {
    id: "",
    email: "exmaple@gmail.com",
    username: "Example User",
    firstName: "",
    lastName: "",
    interests: [],
  };
  const mockMessage: ChatMessage = {
    from: mockUser,
    time: moment().utc(),
    content: "Hello",
  };
  const [messageList, setMessageList] = useState<ChatMessage[]>([mockMessage]);

  const [inputContent, setInputContent] = useState<string>("");

  const send = () => {
    setMessageList([
      ...messageList,
      {
        from: me,
        time: moment().utc(),
        content: inputContent,
      },
    ]);
    setInputContent("");
  };
  return (
    <div className="flex flex-col justify-end h-screen py-8">
      <div className="flex flex-col gap-2 text-xl mb-2">
        {messageList.map((message) => {
          if (message.from.username === "Me") {
            return (
              <span
                className="flex w-full justify-end items-center"
                key={"Me " + message.content}
              >
                {message.content} :Me
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
              {message.from.username}: {message.content}
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
            <IconButton edge="end" onClick={send}>
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </div>
  );
}
