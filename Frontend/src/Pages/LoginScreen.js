import { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import supabase from "../helper/SupabaseClient";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
    };
    checkUser();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      Swal.fire({
        title: "Login Failed",
        text: error.message,
        icon: "error",
        confirmButtonText: "Try Again",
      });
      setFormData({ email: "", password: "" });
      return;
    }

    const user = data.user;
    const session = data.session;

    if (session) {
      localStorage.setItem("access_token", session.access_token);
      localStorage.setItem("refresh_token", session.refresh_token);
      console.log("Tokens stored in localStorage.");
    }

    if (user?.email_confirmed_at) {
      try {
        const token = localStorage.getItem("access_token");
        const checkRes = await fetch(`http://0.0.0.0:8081/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (checkRes.status === 404) {
          const createRes = await fetch("http://0.0.0.0:8081/users", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: user.id,
              full_name: user.user_metadata.full_name,
              email: user.user_metadata.email,
              phone_number: user.user_metadata.phone_number,
              is_admin: false,
            }),
          });

          if (!createRes.ok) {
            const resJson = await createRes.json();
            console.error("Profile creation failed:", resJson.message);
          } else {
            console.log("Profile created successfully");
          }
        } else if (checkRes.ok) {
          console.log("User profile already exists.");
        } else {
          console.error(
            "Unexpected response while checking profile:",
            checkRes.status
          );
        }
      } catch (err) {
        console.error("Error during profile check/creation:", err.message);
      }
    }

    Swal.fire({
      title: "Success!",
      text: "You have successfully logged in.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      navigate("/home");
    });
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      Swal.fire("Error", "Please enter your email to reset password", "error");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      formData.email,
      {
        redirectTo: "http://10.91.182.122:3000/reset-password",
      }
    );

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire(
        "Success!",
        "Check your email for reset instructions.",
        "success"
      );
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
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
        onClick={() => navigate("/")}
      >
        SingScape
      </header>

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
            Log In
          </Typography>
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
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "16px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!(formData.email && formData.password)}
              sx={{ mr: "16px", width: "180px" }}
            >
              Log In
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate(`/forgot-password`)}
            >
              Forgot Password?
            </Button>
          </div>
          <div style={{ marginTop: "16px" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/signup")}
              fullWidth
            >
              Don't have an account? Sign Up
            </Button>
          </div>
        </Paper>
      </main>

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
