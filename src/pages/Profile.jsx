import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Box, Typography, Paper, Divider, useTheme } from "@mui/material";
import Loading from "../components/Loading";

export default function Profile() {
  const theme = useTheme();
  const { user } = useSelector((s) => s.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const snap = await getDoc(doc(db, "users", user.uid));
      setProfile(snap.exists() ? snap.data() : null);
      setLoading(false);
    };
    if (user) run();
  }, [user]);

  if (!user) return null;
  if (loading) return <Loading message="Fetching profile..." />;

  return (
    <Box
      sx={{
        mt: 4,
        px: 2,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 600,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}99, ${theme.palette.secondary.main}99)`,
          py: 6,
          px: 3,
          textAlign: "center",
          color: theme.palette.common.white,
          boxShadow: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            textShadow: "1px 1px 4px rgba(0,0,0,0.4)",
          }}
        >
          User Profile
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          Overview of your account information
        </Typography>

        <Paper
          elevation={6}
          sx={{
            mt: 4,
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: 6,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: 8,
              transform: "translateY(-3px)",
            },
          }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: "bold", mb: 2}}
          >
            Profile Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography sx={{ mb: 1 }}>
            <b>Email:</b> {user.email}
          </Typography>
          <Typography sx={{ mb: 1 }}>
            <b>Display Name:</b> {user.displayName || "—"}
          </Typography>
          <Typography sx={{ mb: 1 }}>
            <b>Role:</b> {user.role}
          </Typography>
          {profile && (
            <Typography sx={{ mb: 1 }}>
              <b>Username:</b> {profile.username}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
