import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Navigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Card,
  useTheme,
} from "@mui/material";
import Loading from "../components/Loading";

export default function Admin() {
  const { user } = useSelector((s) => s.auth);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchApplications = async () => {
      const q = query(
        collection(db, "jobApplications"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };

    fetchApplications();
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  if (loading) return <Loading message="Loading applications..." />;

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 4,
          py: 4,
          px: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}99, ${theme.palette.secondary.main}99)`,
          color: theme.palette.common.white,
          textAlign: "center",
          boxShadow: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1">
          Manage all job applications submitted by users
        </Typography>
      </Box>

      {rows.length === 0 ? (
        <Card
          sx={{
            p: 4,
            textAlign: "center",
            backgroundColor: theme.palette.background.paper,
            boxShadow: 6,
            borderRadius: 3,
            transition: "0.3s",
            "&:hover": { boxShadow: 8, transform: "translateY(-2px)" },
          }}
        >
          <Typography color="text.secondary" variant="h6">
            No applications found.
          </Typography>
        </Card>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: 4,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                {["Company", "Position", "Status", "User ID"].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      color: theme.palette.primary.contrastText,
                      fontWeight: "bold",
                      fontSize: 14,
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow
                  key={r.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                      transform: "translateX(5px)",
                      transition: "all 0.3s ease",
                    },
                  }}
                >
                  <TableCell sx={{ fontWeight: "500" }}>{r.company}</TableCell>
                  <TableCell sx={{ fontWeight: "500" }}>{r.position}</TableCell>
                  <TableCell>
                    <Chip
                      label={r.status}
                      color={
                        r.status === "pending"
                          ? "warning"
                          : r.status === "accepted"
                          ? "success"
                          : "error"
                      }
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {r.userId}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
