import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  addApplication,
  deleteApplication,
  setApplications,
  updateApplication,
} from "../redux/slices/jobSlice";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Chip,
  useTheme,
} from "@mui/material";
import Loading from "../components/Loading";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { applications } = useSelector((s) => s.jobs);
  const theme = useTheme();

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("applied");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchApps = async () => {
      setLoading(true);
      const q = query(
        collection(db, "jobApplications"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const apps = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      dispatch(setApplications(apps));
      setLoading(false);
    };
    fetchApps();
  }, [user, dispatch]);

  const filteredApps = useMemo(() => {
    if (statusFilter === "all") return applications;
    return applications.filter((a) => a.status === statusFilter);
  }, [applications, statusFilter]);

  const resetForm = () => {
    setCompany("");
    setPosition("");
    setStatus("applied");
    setEditingId(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = {
      company,
      position,
      status,
      userId: user.uid,
      createdAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, "jobApplications"), payload);
    dispatch(addApplication({ id: ref.id, ...payload }));
    resetForm();
    Swal.fire({ icon: "success", title: "Application added" });
  };

  const startEdit = (app) => {
    setEditingId(app.id);
    setCompany(app.company);
    setPosition(app.position);
    setStatus(app.status);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const ref = doc(db, "jobApplications", editingId);
    await updateDoc(ref, { company, position, status });
    dispatch(updateApplication({ id: editingId, company, position, status }));
    resetForm();
    Swal.fire({ icon: "success", title: "Application updated" });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "jobApplications", id));
    dispatch(deleteApplication(id));
    Swal.fire({ icon: "success", title: "Application deleted" });
  };

  if (!user) return <Typography align="center">Please log in</Typography>;
  if (loading) return <Loading message="Fetching applications..." />;

  const statusColors = {
    applied: "info",
    interview: "primary",
    rejected: "error",
    hired: "success",
  };

  return (
    <Box
      sx={{
        mt: 4,
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // <--- كل شيء بالمنتصف
      }}
    >
      {/* العنوان */}
      <Box
        sx={{
          textAlign: "center",
          py: 4,
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          borderRadius: 3,
          color: theme.palette.common.white,
          boxShadow: 3,
          width: "100%",
          maxWidth: 800, // لتحديد عرض المحتوى
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          Manage your job applications effortlessly!
        </Typography>
      </Box>

      {/* الفورم */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: theme.palette.background.paper,
          boxShadow: 3,
          borderRadius: 3,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: 6,
            transform: "translateY(-2px)",
          },
          width: "100%",
          maxWidth: 800,
        }}
      >
        <form
          onSubmit={editingId ? handleUpdate : handleCreate}
          style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}
        >
          <TextField
            label="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            fullWidth
            required
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              {Object.keys(statusColors).map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              {editingId ? "Update" : "Add"}
            </Button>
            {editingId && (
              <Button type="button" variant="outlined" color="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      {/* فلتر الحالة */}
      <FormControl fullWidth sx={{ mb: 2, maxWidth: 400 }}>
        <InputLabel>Status Filter</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          label="Status Filter"
        >
          <MenuItem value="all">All</MenuItem>
          {Object.keys(statusColors).map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* البطاقات */}
      <Grid container spacing={3} justifyContent="center">
        {filteredApps.map((app) => (
          <Grid item xs={12} sm={6} md={4} key={app.id}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                backgroundColor: theme.palette.background.paper,
                boxShadow: 3,
                borderRadius: 3,
                transition: "all 0.3s ease",
                cursor: "pointer",
                textAlign: "center",
                alignItems: "center",
                "&:hover": {
                  boxShadow: 8,
                  transform: "translateY(-4px) scale(1.02)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                  fontFamily: "'Roboto Slab', serif",
                }}
              >
                {app.company}
              </Typography>
              <Typography sx={{ color: theme.palette.text.secondary }}>
                {app.position}
              </Typography>
              <Chip
                label={app.status}
                color={statusColors[app.status]}
                variant="outlined"
                size="small"
                sx={{ alignSelf: "center" }}
              />
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 1,
                  justifyContent: "center",
                }}
              >
                <Button size="small" variant="outlined" onClick={() => startEdit(app)}>
                  Edit
                </Button>
                <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(app.id)}>
                  Delete
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
