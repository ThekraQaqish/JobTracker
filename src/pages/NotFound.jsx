import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

export default function NotFound() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography
        variant="h2"
        sx={{ fontWeight: "bold", color: theme.palette.primary.main, mb: 2 }}
      >
        404
      </Typography>
      <Typography
        variant="h5"
        sx={{ color: theme.palette.text.primary, mb: 3 }}
      >
        Page Not Found
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        color="primary"
        sx={{ px: 4, py: 1.5 }}
      >
        Go Home
      </Button>
    </Box>
  );
}
