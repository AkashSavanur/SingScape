import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import supabase from "../helper/SupabaseClient";

const CustomerSupport = () => {
  const navigate = useNavigate();
  const form = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        try {
          const token = localStorage.getItem("access_token");
          const res = await fetch(`http://0.0.0.0:8081/users/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (res.ok) {
            const profileData = await res.json();
            setProfile(profileData);
            setName(profileData.full_name || "");
            setEmail(profileData.email || "");
          } else {
            console.error("Failed to fetch profile");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchUserAndProfile();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_9hb3zv8",
        "template_4uerngi",
        form.current,
        "ZTbt6XePuR4A_vicf"
      )
      .then(() => {
        Swal.fire({
          title: "Email Sent!",
          text: "We’ll get back to you as soon as possible.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setSubmitted(true);
        setMessage("");
      })
      .catch((error) => {
        console.error("Email error:", error.text);
        Swal.fire("Oops!", "Something went wrong. Please try again.", "error");
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
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
            maxWidth: "800px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Customer Support
          </Typography>
          <Typography variant="body1" gutterBottom>
            Have a question or need assistance? Fill out the form below, and we&apos;ll get back to you as soon as possible.
          </Typography>

          {submitted ? (
            <Typography
              variant="h6"
              style={{ color: "green", marginTop: "16px" }}
            >
              Thank you for contacting us! We'll respond shortly.
            </Typography>
          ) : (
            <Box
              component="form"
              ref={form}
              onSubmit={handleSubmit}
              style={{ marginTop: "16px" }}
            >
              <TextField
                name="name"
                label="Your Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                name="email"
                label="Your Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                name="message"
                label="Your Message"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <input
                type="hidden"
                name="time"
                value={new Date().toLocaleString()}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: "16px" }}
              >
                Submit
              </Button>
            </Box>
          )}
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
};

export default CustomerSupport;
