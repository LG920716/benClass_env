"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Box from "@mui/material/Box";
import { getUserById, getCourse, getClass, findUserOrderByScore } from "./api/apis";
import { UserResponse, Course, Class } from "@/interface/types";
import Logo from "@/components/logo";
import ClassEnrollDialog from "@/components/classEnrollDialog";
import { Button, Typography, LinearProgress } from "@mui/material";
import { EmojiEvents as EmojiEventsIcon } from "@mui/icons-material";

export default function GridTemplateAreas() {
  const auth = useAuth();
  const [studentData, setStudentData] = useState<UserResponse | null>(null);
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [classData, setClassData] = useState<Class[]>([]); // 用于存储已注册课程
  const [studentRank, setStudentRank] = useState<number | null>(null);
  const [studentOrder, setStudentOrder] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // 获取学生数据
  useEffect(() => {
    if (auth.account?.id) {
      const fetchStudentData = async () => {
        try {
          setLoading(true);
          const response = await getUserById(auth.account.id);
          setStudentData(response);
        } catch (err) {
          setError("無法獲取學生資料");
        } finally {
          setLoading(false);
        }
      };
      fetchStudentData();
    }
  }, [auth.account?.id]);

  // 获取课程数据
  useEffect(() => {
    if (studentData?.courses_enrolled?.length! > 0) {
      const fetchCourseData = async () => {
        try {
          setLoading(true);
          const course = await getCourse(studentData!.courses_enrolled[0]);
          setCourseData(course);
        } catch (err) {
          setError("無法獲取課程資料");
        } finally {
          setLoading(false);
        }
      };
      fetchCourseData();
    }
  }, [studentData?.courses_enrolled]);

  // 获取学生分数排名
  useEffect(() => {
    if (auth.account?.id && studentData?.courses_enrolled?.length! > 0) {
      const fetchStudentScoreData = async () => {
        try {
          setLoading(true);
          const response = await findUserOrderByScore(studentData?.courses_enrolled[0] || "");
          setStudentOrder(response);
          const rank = response.findIndex((user) => user.id === auth.account.id) + 1;
          setStudentRank(rank);
        } catch (err) {
          setError("無法獲取學生分數資料");
        } finally {
          setLoading(false);
        }
      };
      fetchStudentScoreData();
    }
  }, [auth.account?.id, studentData?.courses_enrolled]);

  // 获取已注册课程数据
  useEffect(() => {
    if (studentData?.classes_enrolled && studentData.classes_enrolled.length > 0) {
      const fetchClassData = async () => {
        try {
          setLoading(true);
          const classes = await Promise.all(
            studentData.classes_enrolled.map((classId) => getClass(classId))
          );
          setClassData(classes);
        } catch (err) {
          setError("無法獲取課堂資料");
        } finally {
          setLoading(false);
        }
      };
      fetchClassData();
    }
  }, [studentData?.classes_enrolled]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // 获取到课率
  const calculateAttendanceRate = () => {
    const totalClasses = courseData?.classes?.length || 0;
    const enrolledClasses = studentData?.classes_enrolled?.length || 0;
    return totalClasses ? (enrolledClasses / totalClasses) * 100 : 0;
  };

  return (
    <Box sx={{ width: "100%", height: "calc(100vh - 4rem)", padding: "1rem", color: "#fff" }}>
      {!auth.account?.id ? (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", color: "#000" }}>
          <Logo />
          <p>請先按右上角登入或註冊</p>
        </Box>
      ) : (
        <Box sx={{ height: "100%", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, gridTemplateRows: "auto", gridTemplateAreas: `"main sidebar sidebar" "main sidebar2 sidebar2" "footer footer footer" "footer footer footer"` }}>
          <Box sx={{ gridArea: "main", bgcolor: "secondary.main", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 3 }}>
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>{error}</div>
            ) : !studentData ? (
              <div>沒有學生資料</div>
            ) : studentData.courses_enrolled?.length > 0 ? (
              <>
                <h4>課程資訊</h4>
                <p>課程代碼: {courseData?.id}</p>
                <p>課程名稱: {courseData?.course_name}</p>
                <p>教師: {courseData?.teacher_name}</p>
              </>
            ) : (
              <div>請先點擊右上角頭像註冊課程</div>
            )}
          </Box>

          <Box sx={{ gridArea: "sidebar", bgcolor: "#B5A49A", p: 3 }}>
            <Typography variant="h5" gutterBottom>學生名次</Typography>
            {loading ? (
              <Logo />
            ) : (
              <Box>
                {studentRank != null ? (
                  <Box display="flex" alignItems="center">
                    <EmojiEventsIcon sx={{ color: "#FFD700", marginRight: 1 }} />
                    <Typography variant="body1">你的排名: 第 {studentRank} 名</Typography>
                  </Box>
                ) : (
                  <Typography variant="body1">尚無排名資料</Typography>
                )}
              </Box>
            )}
          </Box>

          <Box sx={{ gridArea: "sidebar2", bgcolor: "#B5A49A", p: 3 }}>
            <Typography variant="h5" gutterBottom>學生到課率</Typography>
            {loading ? (
              <Logo />
            ) : (
              <Box>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                  到課率: {calculateAttendanceRate().toFixed(2)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={calculateAttendanceRate()}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ gridArea: "footer", bgcolor: "#A96A41", p: 2 }}>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
              註冊課堂
            </Button>

            {/* 显示已注册的课程 */}
            {loading ? (
              <Logo />
            ) : (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">已註冊的課堂</Typography>
                {classData.length > 0 ? (
                  <Box sx={{ marginTop: 2 }}>
                    {classData.map((classItem) => (
                      <Box key={classItem.id} sx={{ marginBottom: 1 }}>
                        <Typography variant="body1">
                          <strong>課堂代碼:</strong> {classItem.id}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body1">尚未註冊任何課堂</Typography>
                )}
              </Box>
            )}

            {/* 课程注册对话框 */}
            <ClassEnrollDialog open={dialogOpen} closeDialog={handleCloseDialog} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
