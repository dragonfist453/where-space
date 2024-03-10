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
import {ChatMessage, User, Event as CurrentEvent, Objective, Todo} from "../model";
import ResponsiveAppBar from "@/components/AppBar";
import axios from "axios";
import useWebSocket, { ReadyState } from "react-use-websocket";
import React from "react";
import {useRouter, useSearchParams} from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';

// const me = "666b32f2-4005-48cf-be54-7c3964f9978f";

export default function EventPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [currentEvent, setCurrentEvent] = useState<CurrentEvent>({
    id: "",
    name: "",
    numberOfPeople: -1,
    startTime: moment().utc(),
    endTime: moment().utc(),
    host: "",
    attendee: [],
    summary: "",
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
          summary: data.summary,
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
            <Paper className=" h-1/2 p-8" elevation={3}>
              <div className={"font-bold text-3xl"}>
                Summary
              </div>
              <Divider style={{ paddingTop: "10px" }} />
              <div className={"mt-2 text-xl"}>
                {currentEvent.summary}
              </div>
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
            <TaskSection eventId={id!!}/>
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

function TaskSection({eventId} : {eventId: string}) {
  const router = useRouter()

  useEffect(() => {
    if (window !== undefined) {
      const userId = localStorage.getItem("user_id");
      if (userId !== null) {
        setWS_URL( `ws://10.242.109.78:8000/ws/objective/${eventId}/?user_id=${userId}`);
      } else {
        router.push("/login");
      }
    }
  }, []);

  const [WS_URL, setWS_URL] = useState<string>("");

  // const WS_URL = `ws://10.242.109.78:8000/ws/objective/${eventId}/?user_id=${me}`;

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
      const obj: Objective = JSON.parse(event.data);
      console.log("Objective: ", obj);
      setObjective(obj);
    },
  });
  const [objective, setObjective] = useState<Objective>({
    id: "",
    event: "",
    todos: [],
  });

  const send = () => {
    sendJsonMessage({content: inputContent, objective_id: objective.id});
  };
  const sendDelete = (todo_id: string) => {
    sendJsonMessage({delete_todo: todo_id, objective_id: objective.id});
  }

  const [inputContent, setInputContent] = useState<string>("");

  const addNewTask = () => {
    if (!canSend()) return;

    send();

    setInputContent("");
  }

  const canSend = () => {
    return inputContent.length > 0;
  }

  return (
    <Paper className="flex flex-col h-2/3 p-8 gap-4" elevation={3}>
      <div className="font-bold text-3xl ">Task List</div>
        {objective?.todos?.map((todo, index) => {
            return (
             <TaskCard id={todo.id} content={todo.content} completed={todo.completed} key={todo.id} onDelete={() => {
               sendDelete(todo.id)
             }}/>
            );
          })}
      <Divider />
      <div className={"flex ma"}>
        <TextField
          className={"flex-grow"}
          label="Add Task"
          value={inputContent}
          onChange={(e) => {
            setInputContent(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addNewTask()
            }
          }}
          />
        <IconButton aria-label="add" onClick={addNewTask} disabled={inputContent.length === 0}>
          <SendIcon />
        </IconButton>
      </div>
    </Paper>
  );
}

function TaskCard({ content, completed, onDelete }: Todo & {onDelete: () => void}) {
  return (
    <Card variant="outlined">
      <Checkbox checked={completed} />
      {content}
      <IconButton aria-label="delete" onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
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
  const router = useRouter()

  useEffect(() => {
    if (window !== undefined) {
      const userId = localStorage.getItem("user_id");
      if (userId !== null) {
        setWS_URL( `ws://10.242.109.78:8000/ws/event_room/${id}/?user_id=${userId}`);
        setMe(userId);
      } else {
        router.push("/login");
      }
    }
  }, []);

  const [WS_URL, setWS_URL] = useState<string>("");
  const [me, setMe] = useState<string>("");

  // const WS_URL = `ws://10.242.109.78:8000/ws/event_room/${id}/?user_id=${me}`;

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
