import { Box, Typography } from "@mui/material";
import SportsVolleyballIcon from "@mui/icons-material/SportsVolleyball";

export default function Logo() {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <SportsVolleyballIcon sx={{ mr: 1 }} />
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".3rem",
          color: "inherit",
          textDecoration: "none",
          
        }}
      >
        VolleyMate
      </Typography>
    </Box>
  );
}
