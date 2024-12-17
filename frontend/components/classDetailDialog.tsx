import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  Box,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { getClass, updateScore, groupClass, getScore } from "@/app/api/apis";
import { MatchUpdate, RoundUpdate } from "@/interface/types";

interface ClassDetailDialogProps {
  open: boolean;
  onClose: () => void;
  classId: string;
}

export default function ClassDetailDialog({
  open,
  onClose,
  classId,
}: ClassDetailDialogProps) {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [students, setStudents] = useState<string[]>([]);
  const [groups, setGroups] = useState<Record<string, string[]>[]>([]);
  const [matches, setMatches] = useState<MatchUpdate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const fetchClassData = async () => {
    setLoading(true);
    try {
      const classData = await getClass(classId);
      setStudents(classData.enrolled_students);
      setGroups(classData.groups);
    } catch (error) {
      console.error("Failed to fetch class data", error);
      setSnackbarMessage("無法獲取課堂資料");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchData = async () => {
    setLoading(true);
    try {
      const scoreData = await getScore(classId);
      setMatches(scoreData.matches);
    } catch (error) {
      console.error("Failed to fetch match data", error);
      setSnackbarMessage("無法獲取賽程資料");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId && open) {
      fetchClassData();
      fetchMatchData();
    }
  }, [classId, open]);

  const handleGroup = async () => {
    setLoading(true);
    try {
      await groupClass(classId);
      fetchClassData();
    } catch (error) {
      console.error("Failed to group students", error);
      setSnackbarMessage("分隊失敗");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (
    matchIndex: number,
    roundIndex: number,
    teamName: string,
    value: number
  ) => {
    setMatches((prevMatches) => {
      const updatedMatches = [...prevMatches];
      updatedMatches[matchIndex].rounds[roundIndex].scores[teamName] = value;
      return updatedMatches;
    });
  };

  const handleScoreSubmit = async () => {
    setLoading(true);
    const matchUpdateData = {
      matches: matches.map((match) => ({
        match_number: match.match_number,
        rounds: match.rounds.map((round) => ({
          round_number: round.round_number,
          scores: round.scores,
        })),
      })),
    };

    try {
      await updateScore(classId, matchUpdateData);
      setSnackbarMessage("分數更新成功！");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to update scores", error);
      setSnackbarMessage("更新分數失敗");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>課堂詳細資料</DialogTitle>
      <DialogContent>
        <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)}>
          <Tab label="分隊" />
          <Tab label="賽程表" />
        </Tabs>
        {loading && <CircularProgress sx={{ display: "block", margin: "auto" }} />}
        {tabIndex === 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              分隊結果
            </Typography>
            {groups.length === 0 ? (
              <Button
                onClick={handleGroup}
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
              >
                開始分隊
              </Button>
            ) : (
              <Stack spacing={2}>
                {groups.map((group, index) => (
                  <Paper key={index} sx={{ padding: 2, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      分隊 {index + 1}
                    </Typography>
                    {Object.keys(group).map((teamName) => (
                      <Typography key={teamName}>
                        <strong>{teamName}:</strong> {group[teamName].join(", ")}
                      </Typography>
                    ))}
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        )}
        {tabIndex === 1 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              賽程表
            </Typography>
            {matches.length === 0 ? (
              <Typography variant="body1">沒有賽程資料</Typography>
            ) : (
              <Stack spacing={3}>
                {matches.map((match, matchIndex) => (
                  <Box
                    key={matchIndex}
                    sx={{
                      border: "1px solid #ddd",
                      borderRadius: 2,
                      padding: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      第 {match.match_number} 輪
                    </Typography>
                    <Stack spacing={1}>
                      {match.rounds.map((round, roundIndex) => (
                        <Box
                          key={roundIndex}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                            場{round.round_number}:{" "}
                            {Object.entries(round.scores)[0] && (
                              <>
                                {Object.entries(round.scores)[0][0]} <span> VS </span>
                              </>
                            )}
                            {Object.entries(round.scores)[0] && (
                              <>{Object.entries(round.scores)[1][0]}</>
                            )}
                          </Typography>
                          {Object.entries(round.scores).map(([teamName, score]) => (
                            <TextField
                              key={teamName}
                              label={teamName}
                              variant="outlined"
                              value={score}
                              onChange={(e) =>
                                handleScoreChange(matchIndex, roundIndex, teamName, Number(e.target.value))
                              }
                              sx={{ width: 100 }}
                            />
                          ))}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                ))}
                <Button
                  onClick={handleScoreSubmit}
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  分數結算
                </Button>
              </Stack>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          關閉
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        autoHideDuration={3000}
      />
    </Dialog>
  );
}
