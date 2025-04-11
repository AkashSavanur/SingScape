import React, { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import Swal from "sweetalert2";
import supabase from "../helper/SupabaseClient";
import Navbar from "../Components/Navbar";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const handleSendResetEmail = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire(
        "Reset Link Sent",
        "Please check your email for the reset password link.",
        "success"
      );
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
        <Navbar />
    <Paper elevation={3} style={{ padding: "24px", maxWidth: "400px", margin: "auto", marginTop: "100px" }}>
      <Typography variant="h5" gutterBottom>
        Forgot Password
      </Typography>
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSendResetEmail}
        disabled={!email}
      >
        Send Reset Link
      </Button>
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
