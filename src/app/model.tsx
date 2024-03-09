import { Moment } from "moment";

type Event = {
  id: string;
  booking?: Booking;
  name: string;
  numberOfPeople: number;
  startTime: Moment;
  endTime: Moment;
  host: string;
  attendee: User[];
  showAttendee?: boolean;
};

type ChatMessage = {
  from: User;
  time: Moment;
  content: string;
};

type User = {
  id: string;
  email: string;
  username: string;
};

type Booking = {
  id: string;
  space: Space;
  startTime: Moment;
  endTime: Moment;
};

type Space = {
  id: string;
  name: String;
  url: String;
};

export type { Event, Booking, Space, User, ChatMessage };
