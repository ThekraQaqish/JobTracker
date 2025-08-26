import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";

export default function Navbar({ hideOn = ["/login", "/register"] }) {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const theme = useTheme();
  const location = useLocation();

  // مع HashRouter، المسار سيحتوي على #، لذلك نحتاج إلى تعديل المقارنة
  const currentPath = location.pathname;
  if (hideOn.includes(currentPath)) return null;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
        zIndex: theme.zIndex.drawer + 1,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: theme.palette.common.white, fontSize: "2rem" }}
        >
          Job Tracker
        </Typography>

        <Box sx={{ display: "flex", gap: theme.spacing(2), margin: "0 auto" }}>
          <Button color="inherit" component={Link} to="/#/dashboard" sx={{ textTransform: "none", fontWeight: 500, fontSize: "1.4rem" }}>
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/#/stats" sx={{ textTransform: "none", fontWeight: 500, fontSize: "1.4rem" }}>
            Stats
          </Button>
          <Button color="inherit" component={Link} to="/#/profile" sx={{ textTransform: "none", fontWeight: 500, fontSize: "1.4rem" }}>
            Profile
          </Button>
          {user?.role === "admin" && (
            <Button color="inherit" component={Link} to="/#/admin" sx={{ textTransform: "none", fontWeight: 500, fontSize: "1.4rem" }}>
              Admin
            </Button>
          )}
        </Box>

        {user ? (
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ textTransform: "none", fontWeight: 500, fontSize: "1.4rem" }}
          >
            Logout
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: theme.spacing(1) }}>
            <Button color="inherit" component={Link} to="/#/login" sx={{ textTransform: "none", fontWeight: 500, fontSize: "1.4rem" }}>
              Login
            </Button>
            <Button color="inherit" component={Link} to="/#/register" sx={{ textTransform: "none", fontWeight: 500, fontSize: "1.4rem" }}>
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}