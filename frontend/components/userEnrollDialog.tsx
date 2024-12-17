import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  DialogTitle,
  DialogContent,
  IconButton,
  Dialog,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "@/context/AuthContext";
import { getUserById, enrollUser } from "@/app/api/apis";
import { UserEnrollRequest } from "@/interface/types";

interface UserEnrollDialogProps {
  open: boolean;
  closeDialog: () => void;
}

export default function UserEnrollDialog({
  open,
  closeDialog,
}: UserEnrollDialogProps) {
  const auth = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [enrollData, setEnrollData] = useState<UserEnrollRequest>({
    enroll_type: "COURSE",
    enroll_id: "",
  });
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollCode, setEnrollCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (open) {
      getUserById(auth.account.id)
        .then((response) => {
          setUserData(response);
          setIsEnrolled(response.courses_enrolled.length > 0);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setErrorMessage("無法獲取用戶資料。");
        });
    }
  }, [open, auth.account.id]);

  const handleEnroll = () => {
    if (!enrollCode) {
      setErrorMessage("請輸入註冊代碼！");
      return;
    }

    const enrollRequest = { ...enrollData, enroll_id: enrollCode };

    console.log("Sending enroll request:", enrollRequest);

    enrollUser(auth.account.id, enrollRequest)
      .then((response) => {
        setSuccessMessage("註冊成功！");
        setEnrollCode("");
        setEnrollData((prev) => ({ ...prev, enroll_id: "" }));
        setErrorMessage("");
        setIsEnrolled(true);
      })
      .catch((error) => {
        setErrorMessage("註冊失敗，請檢查代碼是否正確。");
        console.error("Error enrolling user:", error);
      });
  };

  const handleClose = () => {
    closeDialog();
    setErrorMessage("");
    setSuccessMessage("");
    setEnrollCode("");
    setIsEnrolled(false);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Box>
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          註冊課程
        </DialogTitle>
        <DialogContent>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}

          {isEnrolled ? (
            <Alert severity="info">你已註冊過課程</Alert>
          ) : (
            <>
              <TextField
                label="註冊代碼"
                variant="outlined"
                value={enrollCode}
                onChange={(e) => setEnrollCode(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleEnroll}
                fullWidth
              >
                提交註冊
              </Button>
            </>
          )}
        </DialogContent>
      </Box>
    </Dialog>
  );
}
