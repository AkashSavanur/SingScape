import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Box,
  IconButton,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import Navbar from "../Components/Navbar";
import supabase from "../helper/SupabaseClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ProfileScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: "",
    name: "",
    phoneNumber: "",
    email: "",
  });
  const [editingField, setEditingField] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://0.0.0.0:8081/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const profile = await res.json();

      setUser({
        id: user.id,
        name: profile.full_name,
        phoneNumber: profile.phone_number,
        email: profile.email,
        is_admin: profile.is_admin,
      });

      const bookingRes = await fetch(
        `http://0.0.0.0:8081/booking/user/${user.id}/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const bookingData = await bookingRes.json();
      setBookings(bookingData);
    };

    fetchUserData();
  }, []);

  const handleEditField = (field) => {
    setEditingField(field);
  };

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://0.0.0.0:8081/users/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: user.name,
          phone_number: user.phoneNumber,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update profile:", errorText);
        alert("Update failed. Please try again.");
        return;
      }
  
      const updated = await response.json();
      console.log("Profile updated:", updated);
  
      setEditingField(null);
      Swal.fire("Updated!", "Profile updated successfully", "success");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("An unexpected error occurred.");
    }
  };
  

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box flex={1} display="flex" justifyContent="center" alignItems="center" bgcolor="#f4f4f4" py={4}>
        <Paper elevation={3} sx={{ padding: 4, width: "100%", maxWidth: 700 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            Profile Management
          </Typography>

          <Grid container spacing={3}>
            {/* Name */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  label="Full Name"
                  value={user.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  fullWidth
                  disabled={editingField !== "name"}
                />
                {editingField === "name" ? (
                  <IconButton onClick={() => setEditingField(null)} color="error">
                    <CancelIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleEditField("name")} color="primary">
                    <EditIcon />
                  </IconButton>
                )}
              </Stack>
            </Grid>

            {/* Email (non-editable) */}
            <Grid item xs={12}>
              <TextField
                label="Email"
                value={user.email}
                fullWidth
                disabled
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  label="Phone Number"
                  value={user.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  fullWidth
                  disabled={editingField !== "phoneNumber"}
                />
                {editingField === "phoneNumber" ? (
                  <IconButton onClick={() => setEditingField(null)} color="error">
                    <CancelIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleEditField("phoneNumber")} color="primary">
                    <EditIcon />
                  </IconButton>
                )}
              </Stack>
            </Grid>

            {/* Save button */}
            {editingField && (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                  fullWidth
                >
                  Save Changes
                </Button>
              </Grid>
            )}

            {/* View Bookings */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="info"
                fullWidth
                onClick={() => navigate("/bookings")}
              >
                View My Bookings
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Box
        bgcolor="#00002a"
        color="white"
        textAlign="center"
        py={2}
        fontSize="14px"
      >
        &copy; 2025 SingScape. Created by Group FDAC - SC2006.
      </Box>
    </Box>
  );
}
