import { CircularProgress, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function Loading({ message = "Loading..." }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        gap: theme.spacing(2), 
      }}
    >
      <CircularProgress color="primary" /> 
      <Typography variant="h6" color="text.primary">
        {message}
      </Typography>
    </Box>
  );
}
