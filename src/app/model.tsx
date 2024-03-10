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
  from: string;
  time: Moment;
  content: string;
};

type User = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  interests: [];
  openEvents?: boolean;
};

type UserLogin = {
  username: string;
  password: string;
};

type Booking = {
  id: string;
  space: Space;
  startTime: Moment;
  endTime: Moment;
};

type Space = {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  locationUrl: string;
  rating: number;
  type: SpaceType;
  latitude: number;
  longitude: number;
};

export enum SpaceType {
  Silent = "Silent",
  Busy = "Busy",
  Meeting = "Meeting",
}

export type { Event, Booking, Space, User, ChatMessage, UserLogin };
