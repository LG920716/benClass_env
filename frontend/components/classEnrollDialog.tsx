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

interface ClassEnrollDialogProps {
  open: boolean;
  closeDialog: () => void;
}

export default function ClassEnrollDialog({
  open,
  closeDialog,
}: ClassEnrollDialogProps) {
  const auth = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [enrollCode, setEnrollCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [alreadyEnrolledClasses, setAlreadyEnrolledClasses] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      getUserById(auth.account.id)
        .then((response) => {
          setUserData(response);
          setAlreadyEnrolledClasses(response.classes_enrolled || []);
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

    if (alreadyEnrolledClasses.includes(enrollCode)) {
      setErrorMessage("您已經註冊過這個課堂！");
      return;
    }

    const enrollData: UserEnrollRequest = {
      enroll_type: "CLASS",
      enroll_id: enrollCode,
    };

    enrollUser(auth.account.id, enrollData)
      .then((response) => {
        setSuccessMessage("成功註冊課堂！");
        setErrorMessage("");
        setAlreadyEnrolledClasses((prev) => [...prev, enrollCode]);
        setEnrollCode('');
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
    setEnrollCode('');
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
          註冊課堂
        </DialogTitle>
        <DialogContent>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}

          <Box sx={{ marginBottom: 2 }}>
            {alreadyEnrolledClasses.length > 0 ? (
              <Alert severity="info">已註冊課堂：{alreadyEnrolledClasses.join(", ")}</Alert>
            ) : (
              <Alert severity="info">您尚未註冊任何課堂</Alert>
            )}
          </Box>

          {/* 輸入註冊代碼 */}
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
        </DialogContent>
      </Box>
    </Dialog>
  );
}
