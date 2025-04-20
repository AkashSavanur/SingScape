import React, { useEffect, useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import supabase from "../helper/SupabaseClient";
import Navbar from "../Components/Navbar";

export default function ResetPasswordScreen() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.replace("#", "?"));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        supabase.auth
          .setSession({ access_token, refresh_token })
          .then(({ error }) => {
            if (error) {
              console.error("Session error:", error.message);
              setErrorMsg(
                "Session verification failed. Please retry the link."
              );
            }
            setLoading(false);
          });
      } else {
        setErrorMsg("Invalid reset link.");
        setLoading(false);
      }
    } else {
      setErrorMsg("Invalid or expired reset link.");
      setLoading(false);
    }
  }, []);

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
  
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  
    if (error) {
      setErrorMsg(error.message);
    } else {
      const session = await supabase.auth.getSession();
      if (session?.data?.session) {
        localStorage.setItem("access_token", session.data.session.access_token);
        localStorage.setItem("refresh_token", session.data.session.refresh_token);
        console.log("Tokens stored after reset.");
      }
  
      Swal.fire({
        title: "Password Updated",
        text: "Your password has been successfully changed.",
        icon: "success",
        confirmButtonText: "Go to Home",
      }).then(() => navigate("/home"));
    }
  };
  

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Verifying reset session...
      </p>
    );

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <Paper
        elevation={3}
        style={{
          padding: "24px",
          maxWidth: "400px",
          margin: "auto",
          marginTop: "100px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Reset Password
        </Typography>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "16px" }}
          onClick={handleReset}
          disabled={!newPassword || !confirmPassword}
        >
          Reset Password
        </Button>
        {errorMsg && (
          <Typography color="error" style={{ marginTop: "16px" }}>
            {errorMsg}
          </Typography>
        )}
      </Paper>
      <footer
        style={{
          backgroundColor: "#00002a",
          color: "white",
          textAlign: "center",
          padding: "16px",
          fontSize: "14px",
        }}
      >
        &copy; 2025 SingScape. Created by Group FDAC - SC2006.
      </footer>
    </div>
  );
}
