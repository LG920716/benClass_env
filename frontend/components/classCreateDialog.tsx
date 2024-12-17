import {
    Box,
    Button,
    DialogActions,
    IconButton,
    Dialog,
    Typography,
  } from "@mui/material";
  import CloseIcon from "@mui/icons-material/Close";
  
  interface ClassCreateDialogProps {
    open: boolean;
    hide: () => void;
    createClass: () => void;
  }
  
  export default function ClassCreateDialog({
    open,
    hide,
    createClass,
  }: ClassCreateDialogProps) {
    const handleCreateClass = () => {
      createClass();
      hide();
    };
  
    const todayDate = new Date().toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  
    return (
      <Dialog
        onClose={hide}
        open={open}
        sx={{
          "& .MuiDialog-paper": {
            padding: "20px",
            minWidth: "400px",
          },
        }}
      >
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">確認創建課堂</Typography>
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
          </Box>
  
          {/* 顯示今天的日期 */}
          <Typography variant="body1" sx={{ marginBottom: 3 }}>
            今天是 {todayDate}，您確定要創建新的課堂嗎？
          </Typography>
  
          <DialogActions
            sx={{
              justifyContent: "center",
              padding: "16px 0",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateClass}
              sx={{ marginLeft: "8px" }}
            >
              創建
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={hide}
              sx={{ marginLeft: "8px" }}
            >
              取消
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    );
  }
  