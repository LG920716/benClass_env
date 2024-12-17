import {
  Box,
  TextField,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Dialog,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface LoginProps {
  credentials: {
    id: string;
    password: string;
  };
  handleClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  login: () => void;
  hide: () => void;
  open: boolean;
}

export default function UserLoginDialog({ credentials, handleClick, login, hide, open }: LoginProps) {
  return (
    <Dialog onClose={hide} open={open}>
      <Box>
        <DialogTitle>登入</DialogTitle>
        <DialogContent>
          <TextField
            label="學號"
            variant="outlined"
            name="id"
            value={credentials.id}
            onChange={handleClick}
            fullWidth
            margin="normal"
          />
          <TextField
            label="密碼"
            variant="outlined"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleClick}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <IconButton
            aria-label="close"
            onClick={hide}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Button variant="contained" color="primary" onClick={login}>
            登入
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
