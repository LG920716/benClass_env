"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Box from "@mui/material/Box";
import {
  getCourse,
  getUserByCourseId,
  createClass,
  deleteClass,
  userScoreUpdate,
} from "@/app/api/apis";
import { Course, UserResponse, ClassCreateRequest } from "@/interface/types";
import { useRouter, useParams } from "next/navigation";
import Button from "@mui/material/Button";
import ClassCreateDialog from "@/components/classCreateDialog";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ClassDetailDialog from "@/components/classDetailDialog";

export default function CourseRankingPage() {
  const auth = useAuth();
  const router = useRouter();
  const params = useParams();
  const [studentList, setStudentList] = useState<UserResponse[] | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (auth.account?.id && params.id) {
      const fetchCourseData = async () => {
        try {
          setLoading(true);
          const courseResponse = await getCourse(params.id as string);
          setCourse(courseResponse);

          const studentsResponse = await getUserByCourseId(params.id as string);
          const sortedStudents = studentsResponse.sort(
            (a, b) => b.total_score - a.total_score
          );
          setStudentList(sortedStudents);
        } catch (err) {
          setError("無法獲取課程資料");
        } finally {
          setLoading(false);
        }
      };

      fetchCourseData();
    }
  }, [auth.account?.id, params.id]);

  const handleOpenCreateDialog = () => setOpenCreateDialog(true);
  const handleCloseCreateDialog = () => setOpenCreateDialog(false);

  const handleOpenDetailDialog = (classId: string) => {
    setSelectedClassId(classId);
    setOpenDetailDialog(true);
  };
  const handleCloseDetailDialog = () => setOpenDetailDialog(false);

  const handleCreateClass = async () => {
    if (!course) return;

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const newClassData: ClassCreateRequest = {
      date: formattedDate,
      course_id: course.id,
    };

    try {
      const createdClass = await createClass(newClassData);
      console.log("課堂創建成功", createdClass);
      setCourse((prevCourse) => ({
        ...prevCourse!,
        classes: [...(prevCourse?.classes || []), createdClass.id],
      }));
      handleCloseCreateDialog();
    } catch (error) {
      console.error("課堂創建失敗", error);
      alert("課堂創建失敗");
    }
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      await deleteClass(classId);
      const updatedCourse = await getCourse(params.id as string);
      setCourse(updatedCourse);
    } catch (error) {
      setError("刪除課堂失敗");
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedClassId(null);
  };

  const handleEndClass = async (classId: string) => {
    try {
      await userScoreUpdate(classId);
      alert("課堂已結束");
      setCourse((prevCourse) => ({
        ...prevCourse!,
        classes: prevCourse?.classes.filter((id) => id !== classId) || [],
      }));
    } catch (error) {
      setError("結束課堂失敗");
    }
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, classId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedClassId(classId);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 4rem)",
        padding: "1rem",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr",
        gridTemplateAreas: `"ranking classes"`,
        gap: "1rem",
        backdropFilter: "blur(10px)",
        background: "rgba(255, 255, 255, 0.2)",
        borderRadius: "10px",
      }}
    >
      {!auth.account?.id ? (
        <Box
          sx={{
            gridArea: "ranking",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color: "#000",
          }}
        >
          <p>請先登入以查看內容</p>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              gridArea: "ranking",
              width: "100%",
              height: "100%",
              background: "white",
              borderRadius: "10px",
              padding: "1rem",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              overflowY: "auto",
            }}
          >
            <h3>課程排名表</h3>
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>{error}</div>
            ) : studentList ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>
                      排名
                    </th>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>
                      姓名
                    </th>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>
                      總分
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studentList.map((student, index) => (
                    <tr key={student.id}>
                      <td style={{ padding: "0.5rem" }}>{index + 1}</td>
                      <td style={{ padding: "0.5rem" }}>{student.name}</td>
                      <td style={{ padding: "0.5rem" }}>
                        {student.total_score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>目前沒有排名資料</div>
            )}
          </Box>

          <Box
            sx={{
              gridArea: "classes",
              width: "100%",
              height: "100%",
              background: "white",
              borderRadius: "10px",
              padding: "1rem",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              overflowY: "auto",
            }}
          >
            <h3>課堂列表</h3>
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>{error}</div>
            ) : course ? (
              <>
                <ul style={{ paddingLeft: "1rem" }}>
                  {course.classes.map((classId) => (
                    <li
                      key={classId}
                      style={{
                        marginBottom: "1rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>課堂 {classId}</span>
                      <IconButton
                        onClick={(e) => handleOpenMenu(e, classId)}  // 開啟 Menu
                        color="default"
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={selectedClassId === classId}
                        onClose={handleCloseMenu}  // 關閉 Menu
                      >
                        <MenuItem onClick={() => handleOpenDetailDialog(classId)}>
                          查看課堂詳情
                        </MenuItem>
                        <MenuItem onClick={() => handleEndClass(classId)}>
                          結束課堂
                        </MenuItem>
                        <MenuItem onClick={() => handleDeleteClass(classId)}>
                          刪除課堂
                        </MenuItem>
                      </Menu>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div>目前沒有課堂資料</div>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenCreateDialog}
            sx={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              borderRadius: "50%",
              padding: "1rem",
              fontSize: "1.5rem",
            }}
          >
            +
          </Button>

          <ClassCreateDialog
            open={openCreateDialog}
            hide={handleCloseCreateDialog}
            createClass={handleCreateClass}
          />

          <ClassDetailDialog
            open={openDetailDialog}
            onClose={handleCloseDetailDialog}
            classId={selectedClassId as string}
          />
        </>
      )}
    </Box>
  );
}
