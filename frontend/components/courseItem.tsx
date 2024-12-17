import { Box, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import ConfirmationDialog from './alertDialog';
import { Course } from '@/interface/types';
import { useRouter } from "next/navigation";

interface CourseItemProps {
  courses: Course;
  onDelete: (courseId: string) => void;
  onEdit: (course: Course) => void;
  // onClick: () => void;
  sx?: any;
}

export default function CourseItem({ courses, onDelete, onEdit, sx, ...other }: CourseItemProps) {
  const router = useRouter()
  const { id, course_name, students, classes } = courses;
  
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  const handleEdit = () => {
    onEdit(courses);
  };

  const handleDeleteClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    onDelete(id);
    setDialogOpen(false);
  };

  return (
    <Box
      sx={[
        (theme) => ({
          bgcolor: '#fff',
          color: 'grey.800',
          border: '1px solid',
          borderColor: 'grey.300',
          p: 2,
          borderRadius: 2,
          fontSize: '0.875rem',
          fontWeight: '700',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          ...theme.applyStyles('dark', {
            bgcolor: '#101010',
            color: 'grey.300',
            borderColor: 'grey.800',
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleCourseClick(id)}      >
        <span style={{ marginRight: '8px', fontSize: '1rem', fontWeight: 'normal' }}>
          {id}
        </span>
        {course_name}
      </Typography>

      <Typography variant="body2" color="textSecondary">
        學生人數: {students.length || 0}
      </Typography>

      <Typography variant="body2" color="textSecondary">
        課堂數: {classes.length || 0}
      </Typography>

      <Box sx={{ position: 'absolute', bottom: 8, right: 8 }}>
        <IconButton onClick={handleEdit} color="primary">
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleDeleteClick} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>

      <ConfirmationDialog
        open={dialogOpen}
        title="確認刪除課程"
        content={`您確定要刪除課程 ${course_name} 嗎？這將無法復原。`}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}
