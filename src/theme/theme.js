import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6d23b6",
      light: "#ac46a1",
      dark: "#47126b",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ea698b",
      light: "#d55d92",
      dark: "#c05299",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#f9f5fb",
    },
    text: {
      primary: "#1c1c1c",
      secondary: "#571089",
    },
  },
  typography: {
    fontFamily: "'Berkshire Swash', cursive",
    h1: { fontFamily: "'Berkshire Swash', cursive", fontWeight: 400 },
    h2: { fontFamily: "'Berkshire Swash', cursive", fontWeight: 400 },
    h3: { fontFamily: "'Berkshire Swash', cursive", fontWeight: 400 },
    h4: { fontFamily: "'Berkshire Swash', cursive", fontWeight: 400 },
    h5: { fontFamily: "'Berkshire Swash', cursive", fontWeight: 400 },
    h6: { fontFamily: "'Berkshire Swash', cursive", fontWeight: 400 },
    body1: { fontFamily: "'Berkshire Swash', cursive", lineHeight: 1.6 },
    body2: { fontFamily: "'Berkshire Swash', cursive" },
    button: { fontFamily: "'Berkshire Swash', cursive", fontWeight: 400 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          padding: "16px",
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 600,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "#822faf",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        },
      },
    },
  },
});

export default theme;
