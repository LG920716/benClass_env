"use client";
import {
  AppBar,
  Avatar,
  Button,
  Stack,
  Toolbar,
  Box,
  Popover,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { loginUser, registerUser } from "../app/api/apis";
import UserLoginDialog from "../components/userLoginDialog";
import UserRegisterDialog from "../components/userRegisterDialog";
import UserInfoCard from "../components/userInfoCard";
import Logo from "./logo";

export default function Menu() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();

  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [credentials, setCredentials] = useState({
    id: "",
    password: "",
  });
  const [registerInfo, setRegisterInfo] = useState({
    id: "",
    name: "",
    password: "",
    role: "student",
    gender: 0,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLoginDialogOpen = () => setOpenLoginDialog(true);
  const handleRegisterDialogOpen = () => setOpenRegisterDialog(true);

  const handleDialogClose = () => {
    setOpenLoginDialog(false);
    setOpenRegisterDialog(false);
    setCredentials({ id: "", password: "" });
    setRegisterInfo({ id: "", name: "", password: "", role: "student", gender: 0 });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (openLoginDialog) {
      setCredentials((prev) => ({ ...prev, [name as string]: value }));
    } else if (openRegisterDialog) {
      setRegisterInfo((prev) => ({ ...prev, [name as string]: value }));
    }
  };

  const handleLogin = async () => {
    try {
      const response = await loginUser({
        id: credentials.id,
        password: credentials.password,
      });
      const { id, role, name, gender } = response;
      auth.login(id, role, name, gender);

      if (response.role === 'teacher') {
        router.push('/courses');
      }

      handleDialogClose();
    } catch (error) {
      console.error("登入失敗", error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await registerUser(registerInfo);
      const { id, role, name, gender } = response;
      auth.login(id, role, name, gender); // 自動登入
      handleDialogClose();
    } catch (error) {
      console.error("註冊失敗", error);
    }
  };

  const handleLogout = () => {
    auth.logout();
    setAnchorEl(null);
    router.push('/');
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "user-popover" : undefined;

  return (
    <AppBar position="static" sx={{height: "4rem"}}>
      <Toolbar>
        <Logo/>

        <Box sx={{ flexGrow: 1 }} />

        {auth.account.id ? (
          <>
            <Stack direction="row" spacing={2}>
              <Avatar
                alt="User Avatar"
                src="../static/images/user.png"
                onClick={handleAvatarClick}
                sx={{ cursor: "pointer" }}
              />
            </Stack>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <UserInfoCard
                userId={auth.account.id}
                role={auth.account.role}
                name={auth.account.name}
                gender={auth.account.gender}
                onLogout={handleLogout}
              />
            </Popover>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={handleRegisterDialogOpen}>
              註冊
            </Button>
            <Button color="inherit" onClick={handleLoginDialogOpen}>
              登入
            </Button>
          </>
        )}
      </Toolbar>

      <UserLoginDialog
        credentials={credentials}
        handleClick={handleInputChange}
        login={handleLogin}
        hide={handleDialogClose}
        open={openLoginDialog}
      />
      <UserRegisterDialog
        userInfo={registerInfo}
        handleChange={handleInputChange}
        register={handleRegister}
        closeDialog={handleDialogClose}
        open={openRegisterDialog}
      />
    </AppBar>
  );
}
