import {
    Box,
    TextField,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Dialog,
    FormControl,
    FormLabel,
    FormControlLabel,
    RadioGroup,
    Radio,
  } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  
  interface UserRegisterDialogProps {
    userInfo: {
      id: string;
      name: string;
      password: string;
      role: string;
      gender: number;
    };
    handleChange: (
      e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
    ) => void;
    register: () => void;
    closeDialog: () => void;
    open: boolean;
  }
  
  export default function UserRegisterDialog({
    userInfo,
    handleChange,
    register,
    closeDialog,
    open,
  }: UserRegisterDialogProps) {
    const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const genderChangeEvent = {
        target: {
          name: "gender",
          value: event.target.value === "1" ? 1 : 2, // '1' = 男, '2' = 女
        },
      };
  
      handleChange(genderChangeEvent as unknown as React.ChangeEvent<HTMLInputElement>);
    };
  
    return (
      <Dialog onClose={closeDialog} open={open}>
        <Box>
          <DialogTitle>註冊</DialogTitle>
          <DialogContent>
            <TextField
              label="學號"
              variant="outlined"
              name="id"
              value={userInfo.id}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="姓名"
              variant="outlined"
              name="name"
              value={userInfo.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="密碼"
              variant="outlined"
              name="password"
              type="password"
              value={userInfo.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">性別</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="gender"
                value={userInfo.gender.toString()}
                onChange={handleGenderChange}
              >
                <FormControlLabel value="1" control={<Radio />} label="男" />
                <FormControlLabel value="2" control={<Radio />} label="女" />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <IconButton
              aria-label="close"
              onClick={closeDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Button variant="contained" color="primary" onClick={register}>
              註冊
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    );
  }
  