import { useState } from "react";
import { auth, db } from "../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
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

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      await setDoc(
        doc(db, "users", result.user.uid),
        {
          uid: result.user.uid,
          username: result.user.displayName || username || "",
          email: result.user.email,
          role: "user",
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
      Swal.fire({ icon: "success", title: "Registered successfully" });
      navigate("/dashboard");
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
    if (password !== confirmPassword) {
      Swal.fire({ icon: "error", title: "Passwords do not match" });
      return;
    }
    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        username,
        email,
        role: "user",
        createdAt: serverTimestamp(),
      });
      Swal.fire({ icon: "success", title: "Registered successfully" });
      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: firebaseErrorMessages[error.code] || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Registering..." />;

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
          Create Account
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary">
          Register to start using your account
        </Typography>

        <Divider sx={{ my: 1 }} />

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <TextField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
          />
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
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </form>

        <Divider sx={{ my: 1 }}>OR</Divider>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleGoogleRegister}
          fullWidth
        >
          Continue with Google
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "inherit", fontWeight: 600 }}>
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
