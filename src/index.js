// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { setUser, clearUser } from "./redux/slices/authSlice";

onAuthStateChanged(auth, async (fbUser) => {
  if (fbUser) {
    const snap = await getDoc(doc(db, "users", fbUser.uid));
    const profile = snap.exists() ? snap.data() : {};
    store.dispatch(
      setUser({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || profile.username || "",
        role: profile.role || "user",
      })
    );
  } else {
    store.dispatch(clearUser());
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
