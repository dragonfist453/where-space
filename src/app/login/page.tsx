"use client";

import {Button, Modal, TextField} from "@mui/material";
import {useState} from "react";
import {UserLogin} from "@/app/model";
import axios from "@/app/utils/axios-instance";
import ResponsiveAppBar from "@/components/AppBar";

export default function LoginForm() {
  const [userLogin, setUserLogin] = useState<UserLogin>({
    username: "",
    password: "",
  });

  return (
    <div>
      <ResponsiveAppBar />
      <TextField
        label="Username"
        value={userLogin.username}
        onChange={(e) => setUserLogin({...userLogin, username: e.target.value})}
      />
      <TextField
        id="filled-number"
        label="Password"
        type="password"
        value={userLogin.password}
        onChange={(e) =>
          setUserLogin({...userLogin, password: e.target.value})
        }
        InputLabelProps={{
          shrink: true,
        }}
      />
      <div>
        <Button
          onClick={() => {
            axios.post("users/login/", {
              ...userLogin
            });
          }}
        >
          Create
        </Button>
      </div>
    </div>
  );
}
