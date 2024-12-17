"use client";
// import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import CourseCreateDialog from "@/components/courseCreateDialog";
import CourseItem from "@/components/courseItem";
import { Course, CourseCreateRequest } from "@/interface/types";
import {
  getCourseByTeacher,
  createCourse,
  deleteCourse,
  updateCourse,
} from "../api/apis";
import axios from "axios";
import CourseEditDialog from "@/components/courseUpdateDialog";
import { useRouter } from "next/navigation";

export default function Courses() {
  const router = useRouter()
  const auth = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);



  const fetchCourses = useCallback(async () => {
    if (auth.account?.id) {
      try {
        setLoading(true);
        const response = await getCourseByTeacher(auth.account.name);
        setCourses(response);
      } catch (err) {
        setError("無法獲取課程資料");
      } finally {
        setLoading(false);
      }
    }
  }, [auth.account?.id]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const showDialog = () => setOpenDialog(true);
  const hideDialog = () => setOpenDialog(false);

  const handleCreateCourse = async (courseName: string) => {
    const courseCreateData: CourseCreateRequest = {
      course_name: courseName,
      teacher_name: auth.account.name,
    };

    try {
      await createCourse(courseCreateData);
      fetchCourses();
    } catch (error) {
      setError("創建課程失敗");
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      fetchCourses();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(`刪除失敗: ${error.response.data.message || "未知錯誤"}`);
      } else {
        setError("刪除失敗，請稍後再試");
      }
    }
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setOpenEditDialog(true);
  };

  const handleUpdateCourse = async (newCourseName: string) => {
    if (!selectedCourse) return;

    const updateData = {
      action: "UPDATE" as "UPDATE",
      course_name: newCourseName,
    };

    try {
      await updateCourse(selectedCourse.id, updateData);
      setOpenEditDialog(false);
      fetchCourses();
    } catch (error) {
      setError("更新課程名稱失敗");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ width: "100%", padding: "1rem" }}>
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}

      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" color="secondary" onClick={showDialog}>
          創建課程
        </Button>
      </Box>

      <Box
        sx={{ display: "grid", gap: 1, gridTemplateColumns: "repeat(2, 1fr)" }}
      >
        {courses.map((course) => (
          <CourseItem
            key={course.id}
            courses={course}
            onDelete={handleDeleteCourse}
            onEdit={handleEditCourse}
            sx={{ minHeight: "10rem" }}
          />
        ))}
      </Box>

      <CourseCreateDialog
        open={openDialog}
        hide={hideDialog}
        createCourse={handleCreateCourse}
      />

      <CourseEditDialog
        open={openEditDialog}
        hide={() => setOpenEditDialog(false)}
        currentCourseName={selectedCourse?.course_name || ""}
        updateCourse={handleUpdateCourse}
      />
    </div>
  );
}
