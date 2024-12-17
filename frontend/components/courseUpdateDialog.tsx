import { Box, TextField, Button, DialogTitle, DialogContent, DialogActions, IconButton, Dialog } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";

interface CourseEditDialogProps {
  open: boolean;
  hide: () => void;
  currentCourseName: string;
  updateCourse: (newCourseName: string) => void;
}

export default function CourseEditDialog({
  open,
  hide,
  currentCourseName,
  updateCourse,
}: CourseEditDialogProps) {
  const [courseName, setCourseName] = useState(currentCourseName);

  useEffect(() => {
    setCourseName(currentCourseName);
  }, [currentCourseName]);

  const handleCourseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseName(e.target.value);
  };

  const handleUpdateCourse = () => {
    if (courseName.trim() === "") {
      alert("課程名稱不能為空！");
      return;
    }
    updateCourse(courseName);
    hide();
  };

  return (
    <Dialog onClose={hide} open={open}>
      <Box>
        <DialogTitle>
          修改課程名稱
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
          <Button variant="contained" color="primary" onClick={handleUpdateCourse}>
            更新
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
