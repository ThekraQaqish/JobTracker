import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Grid, Paper, useTheme } from "@mui/material";

export default function Stats() {
  const theme = useTheme();
  const { applications } = useSelector((s) => s.jobs);

  const counts = useMemo(() => {
    const c = { total: applications.length, applied: 0, interview: 0, rejected: 0, hired: 0 };
    for (const a of applications) {
      if (a.status && c[a.status] !== undefined) c[a.status] += 1;
    }
    return c;
  }, [applications]);

  const statsData = [
    { label: "Total", value: counts.total, color: theme.palette.primary.main },
    { label: "Applied", value: counts.applied, color: theme.palette.info.main },
    { label: "Interview", value: counts.interview, color: theme.palette.warning.main },
    { label: "Rejected", value: counts.rejected, color: theme.palette.error.main },
    { label: "Hired", value: counts.hired, color: theme.palette.success.main },
  ];

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          py: 4,
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          borderRadius: 3,
          color: theme.palette.common.white,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            fontFamily: "'Roboto Slab', serif",
            textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          Statistics
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          Overview of your job applications
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {statsData.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                borderRadius: 3,
                background: `linear-gradient(145deg, ${s.color}33, ${s.color}77)`,
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-5px) scale(1.03)",
                  boxShadow: 6,
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  fontFamily: "'Roboto Slab', serif",
                  color: theme.palette.text.primary,
                }}
              >
                {s.label}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                }}
              >
                {s.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
