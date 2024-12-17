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
  import { useState } from "react";
  
  interface CourseCreateDialogProps {
    open: boolean;
    hide: () => void;
    createCourse: (courseName: string) => void;
  }
  
  export default function CourseCreateDialog({
    open,
    hide,
    createCourse,
  }: CourseCreateDialogProps) {
    const [courseName, setCourseName] = useState("");
  
    const handleCourseNameChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      setCourseName(e.target.value);
    };
  
    const handleCreateCourse = () => {
      if (courseName.trim() === "") {
        alert("課程名稱不能為空！");
        return;
      }
      createCourse(courseName);
      setCourseName("");
      hide();
    };
  
    return (
      <Dialog onClose={hide} open={open}>
        <Box>
          <DialogTitle>
            創建課程
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
          </DialogTitle>
          <DialogContent>
            <TextField
              label="課程名稱"
              variant="outlined"
              value={courseName}
              onChange={handleCourseNameChange}
              fullWidth
              margin="normal"
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateCourse}
            >
              創建
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    );
  }
  