import { useState } from "react";
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
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  RadioGroup,
  Radio,
  SelectChangeEvent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmationDialog from "./alertDialog";
import { useAuth } from "@/context/AuthContext";

interface EditUserDialogProps {
  updateUser: (updatedUser: any) => void;
  closeDialog: () => void;
  open: boolean;
}

export default function UserUpdateDialog({
  updateUser,
  closeDialog,
  open,
}: EditUserDialogProps) {
  const auth = useAuth();
  const [selectedField, setSelectedField] = useState<string>("name");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [updateData, setUpdateData] = useState<string | number>();

  const handleFieldChange = (event: SelectChangeEvent<string>) => {
    setSelectedField(event.target.value as string);
  };

  const handleSubmit = () => {
    setOpenConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setOpenConfirmation(false);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setUpdateData(value);
  };

  const handleConfirm = () => {
    const updatedData = { [selectedField]: updateData };
    if (selectedField === "name") {
      updatedData.name = updateData;
      auth.updateAccount({ name: updateData as string });
    }
    if (selectedField === "gender") {
      updatedData.gender = updateData === "1" ? "男" : "女";
      auth.updateAccount({ gender: updateData === "1" ? 1 : 2 });
    }
    updateUser(updatedData);
    setOpenConfirmation(false);
    closeDialog();
  };

  return (
    <>
      <Dialog onClose={closeDialog} open={open}>
        <Box>
          <DialogTitle>編輯用戶</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>選擇修改欄位</InputLabel>
              <Select
                value={selectedField}
                label="選擇修改欄位"
                onChange={handleFieldChange}
              >
                <MenuItem value="name">姓名</MenuItem>
                <MenuItem value="password">密碼</MenuItem>
                <MenuItem value="gender">性別</MenuItem>
              </Select>
            </FormControl>

            {selectedField === "name" && (
              <TextField
                label="姓名"
                variant="outlined"
                name="name"
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            )}

            {selectedField === "password" && (
              <TextField
                label="密碼"
                variant="outlined"
                name="password"
                type="password"
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            )}

            {selectedField === "gender" && (
              <FormControl fullWidth margin="normal">
                <RadioGroup
                  row
                  aria-labelledby="gender-radio-group-label"
                  name="gender"
                  onChange={handleChange}
                >
                  <FormControlLabel value={1} control={<Radio />} label="男" />
                  <FormControlLabel value={2} control={<Radio />} label="女" />
                </RadioGroup>
              </FormControl>
            )}
          </DialogContent>

          <DialogActions>
            <IconButton
              aria-label="close"
              onClick={closeDialog}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              確認修改
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmationDialog
        open={openConfirmation}
        title="確認修改"
        content={`您確定要修改這個用戶的${
          selectedField === "name"
            ? "姓名"
            : selectedField === "password"
            ? "密碼"
            : "性別"
        }嗎？`}
        onClose={handleConfirmationClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}
