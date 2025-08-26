import { useState } from "react";
import { auth } from "../firebase/firebase";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  Toolbar,
} from "@mui/material";
import Loading from "../components/Loading";

const googleProvider = new GoogleAuthProvider();

const firebaseErrorMessages = {
  "auth/email-already-in-use": "This email is already registered",
  "auth/invalid-email": "Please enter a valid email address",
  "auth/weak-password": "Password must be at least 6 characters",
  "auth/user-not-found": "No account found with this email",
  "auth/wrong-password": "Incorrect password",
  "auth/too-many-requests": "Too many attempts. Try again later",
  "auth/user-disabled": "This account has been disabled",
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      Swal.fire({ icon: "success", title: "Login successfully" }).then(() => {
        navigate("/dashboard");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: firebaseErrorMessages[err.code] || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire({ icon: "success", title: "Login successfully" }).then(() => {
        navigate("/dashboard");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: firebaseErrorMessages[err.code] || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Logging in..." />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        p: 2,
        background: (theme) =>
          `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), 
          linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.main})`,
      }}
    >
      <Toolbar />
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 400,
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography variant="h5" align="center" fontWeight={600}>
          Welcome Back 👋
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary">
          Please login to continue
        </Typography>

        <Divider sx={{ my: 1 }} />

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>

        <Divider sx={{ my: 1 }}>OR</Divider>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleGoogleLogin}
          fullWidth
        >
          Continue with Google
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "inherit", fontWeight: 600 }}>
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
