import { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import supabase from "../helper/SupabaseClient";

export default function SignUpScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    Swal.fire({
      title: "Almost there!",
      text: "Check your email to verify your account.",
      icon: "info",
      confirmButtonText: "OK",
    });

    setFormData({ fullName: "", email: "", password: "", phoneNumber: "" });
    navigate('/login')
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "#fff",
          color: "black",
          textAlign: "center",
          padding: "16px",
          fontSize: "36px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        onClick={() => navigate("/home")}
      >
        SingScape
      </header>

      {/* Main Sign Up Form */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f4f4f4",
          padding: "24px",
        }}
      >
        <Paper
          elevation={3}
          style={{
            padding: "24px",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" style={{ marginBottom: "16px" }}>
            Sign Up
          </Typography>
          <TextField
            label="Full Name"
            name="fullName"
            fullWidth
            margin="normal"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            fullWidth
            margin="normal"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "16px" }}
            onClick={handleSubmit}
            disabled={
              !(
                formData.email &&
                formData.phoneNumber &&
                formData.fullName &&
                formData.password
              )
            }
          >
            Sign Up
          </Button>
          <div style={{ marginTop: "16px" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/login')}
              fullWidth
            >
              Already have an account? Log In
            </Button>
          </div>
          {message && (
            <Typography style={{ marginTop: "16px", color: "red" }}>
              {message}
            </Typography>
          )}
        </Paper>
      </main>

      {/* Footer */}
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
