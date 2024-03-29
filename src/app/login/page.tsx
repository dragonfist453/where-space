"use client";

import { Box, Button, Container, Grid, Modal, TextField } from "@mui/material";
import { useState } from "react";
import {User, UserLogin} from "@/app/model";
import axios from "@/app/utils/axios-instance";
import ResponsiveAppBar from "@/components/AppBar";
import {useRouter} from "next/navigation";

export default function LoginForm() {
  const [userLogin, setUserLogin] = useState<UserLogin>({
    username: "",
    password: "",
  });

  const router = useRouter();

  return (
    <>
      <ResponsiveAppBar />
      <Container
        fixed
        style={{ height: "94vh", width: "100vw", alignItems: "center" }}
      >
        <Grid
          container
          spacing={2}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          style={{ margin: "auto" }}
        >
          <Grid item xs={12}>
            <TextField
              label="Username"
              value={userLogin.username}
              onChange={(e) =>
                setUserLogin({ ...userLogin, username: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="filled-number"
              label="Password"
              type="password"
              value={userLogin.password}
              onChange={(e) =>
                setUserLogin({ ...userLogin, password: e.target.value })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Button
            onClick={() => {
              axios.post("users/login/", {
                ...userLogin,
              }).then((res) => {
                console.log(res.data);
                const user: User = res.data;
                localStorage.setItem("user_id", user.id);
                router.push("/")
              });
            }}
          >
           Login
          </Button>
        </Grid>
      </Container>
    </>
  );
}
