import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { updateUser } from "@/app/api/apis";
import UserUpdateDialog from "./userUpdateDialog";
import UserEnrollDialog from "./userEnrollDialog";

interface UserInfoCardProps {
  userId: string;
  role: string;
  gender: number;
  name: string;
  onLogout: () => void;
}

export default function UserInfoCard({
  userId,
  role,
  gender,
  name,
  onLogout,
}: UserInfoCardProps) {
  const auth = useAuth();

  const [openDialog, setOpenDialog] = useState(false);
  const [openEnroll, setOpenEnroll] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenEnrollDialog = () => {
    setOpenEnroll(true);
  };

  const handleCloseEnrollDialog = () => {
    setOpenEnroll(false);
  };

  const handleUpdateUser = (updatedUser: any) => {
    updateUser(auth.account.id, updatedUser)
      .then(response => {
        console.log("User updated successfully", response);
      })
      .catch(error => {
        console.error("Error updating user:", error);
      });
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          width: 320,
          overflow: "auto",
          resize: "horizontal",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          {gender === 1 ? (
            <Avatar src="/static/images/boy.png" sx={{ width: 56, height: 56 }} />
          ) : (
            <Avatar
              src="/static/images/girl.png"
              sx={{ width: 56, height: 56 }}
            />
          )}
        </Box>
        <CardContent>
          <Typography variant="h6">{userId}</Typography>
          <Typography variant="body2">姓名: {name}</Typography>
          <Typography variant="body2">Role: {role}</Typography>
        </CardContent>
        <CardActions>
          <Button variant="outlined" color="secondary" onClick={handleOpenDialog}>
            修改資料
          </Button>
          {auth.account.role === "student" && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleOpenEnrollDialog}
            >
              註冊課程
            </Button>
          )}
          <Button variant="outlined" color="secondary" onClick={onLogout}>
            登出
          </Button>
        </CardActions>
      </Card>

      <UserUpdateDialog
        updateUser={handleUpdateUser}
        closeDialog={handleCloseDialog}
        open={openDialog}
      />

      <UserEnrollDialog
        open={openEnroll}
        closeDialog={handleCloseEnrollDialog}
      />
    </>
  );
}
