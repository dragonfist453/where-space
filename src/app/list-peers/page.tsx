/* eslint-disable @next/next/no-img-element */
"use client";

import { Card, Collapse, IconButton } from "@mui/material";
import { use, useEffect, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { User } from "../model";
import axios from "axios";
import ChatIcon from "@mui/icons-material/Chat";
import ResponsiveAppBar from "@/components/AppBar";

export default function ListPeers() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    axios
      .get("http://10.242.109.78:8000/users")
      .then(function (response) {
        const resUsers: User[] = [];
        response.data.map((user: any) => {
          resUsers.push({
            id: user.id,
            email: user.email,
            username: user.userame,
            firstName: user.first_name,
            lastName: user.last_name,
            interests: user.interests,
            openEvents: false,
          });
        });
        setUsers(resUsers);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  return (
    <>
      <ResponsiveAppBar />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col gap-6">
          {users.map((user: User) => {
            return (
              <div
                className=" bg-blue-500 rounded-l-full rounded-r-full shadow-md my-2"
                key={user.id}
              >
                <div className="flex flex-row">
                  <img
                    src="https://api.dicebear.com/7.x/pixel-art/svg"
                    className="w-48 h-48 rounded-full border-8 shadow-lg "
                    alt="profile-pic"
                  />
                  <div className="w-96 bg-blue-500 rounded-r-3xl flex z-20">
                    <div className="flex flex-row h-full w-96 justify-start p-6">
                      <div className="flex flex-col">
                        <div className="text-3xl w-full text-white font-bold">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="flex flex-row gap-2 pt-1">
                          {user.interests.map((interest: string) => {
                            return (
                              <div
                                className=" text-lg rounded-md w-full text-blue-500 px-2 bg-white font-semibold whitespace-nowrap"
                                key={user.id + interest}
                              >
                                {interest}
                              </div>
                            );
                          })}
                        </div>
                        <button className="fixed mt-28 ml-64 rounded-md bg-white text-blue-500 p-1">
                          <ChatIcon />
                        </button>
                      </div>
                    </div>
                    <div className="fixed h-48 flex ml-80 z-10">
                      <div
                        className="h-full flex flex-row items-center"
                        onClick={() =>
                          setUsers((prevUsers) =>
                            prevUsers.map((prevUser) =>
                              prevUser.id === user.id
                                ? { ...prevUser, openEvents: !user.openEvents }
                                : prevUser
                            )
                          )
                        }
                      >
                        <IconButton className="p-0 mr-1 " onClick={() => {}}>
                          <ChevronRightIcon className="text-3xl text-white" />
                        </IconButton>
                      </div>
                      <Collapse
                        orientation="horizontal"
                        className="bg-white h-full w-32 relative "
                        in={user.openEvents}
                      >
                        <div className="bg-gray-100 flex flex-col shadow-md h-full w-60 rounded-r-3xl p-2">
                          <div className="text-lg font-semibold">
                            Group Events
                          </div>
                          <div className="w-full flex items-center">
                            Group Events
                            <IconButton
                              className="p-0 mr-1 "
                              onClick={() => {}}
                            >
                              <AddCircleOutlineIcon />
                            </IconButton>
                          </div>
                        </div>
                      </Collapse>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
