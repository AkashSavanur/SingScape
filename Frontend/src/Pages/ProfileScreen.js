import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { TextField, Button, Box, Paper, Grid } from "@mui/material";
import supabase from "../helper/SupabaseClient";
import { useNavigate } from "react-router-dom";

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
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return;

      console.log(user);

      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `http://0.0.0.0:8081/users/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch profile");

        const profile = await response.json();

        console.log(profile);

        setUser({
          id: user.id,
          name: profile.full_name,
          phoneNumber: profile.phone_number,
          email: profile.email,
          is_admin: profile.is_admin,
        });

        if (user?.id) {
          try {
            const token = localStorage.getItem("access_token");
            const bookingResponse = await fetch(
              `http://0.0.0.0:8081/booking/user/${user.id}/details`
              ,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });
            if (!bookingResponse.ok)
              throw new Error("Failed to fetch bookings");

            const bookingData = await bookingResponse.json();
            console.log("Bookings:", bookingData);

            setBookings(bookingData);
          } catch (err) {
            console.error("Error fetching bookings:", err.message);
          }
        }
      } catch (err) {
        console.error("Error fetching profile from backend:", err.message);
      }
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
    setEditingField(null);
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
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
          <h1>Profile Management</h1>
          <Box>
            <h2>Edit Profile</h2>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  value={user.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  fullWidth
                  disabled={editingField !== "name"}
                />
                <Button
                  onClick={() =>
                    handleEditField(editingField === "name" ? null : "name")
                  }
                >
                  {editingField === "name" ? "Cancel" : "Edit Name"}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  value={user.email}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone Number"
                  value={user.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  fullWidth
                  disabled={editingField !== "phoneNumber"}
                />
                <Button
                  onClick={() =>
                    handleEditField(
                      editingField === "phoneNumber" ? null : "phoneNumber"
                    )
                  }
                >
                  {editingField === "phoneNumber" ? "Cancel" : "Edit Phone"}
                </Button>
              </Grid>
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

            {editingField && (
              <Button variant="contained" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            )}
          </Box>
        </Paper>
      </main>
      <footer
        style={{
          backgroundColor: "#00002a",
          color: "white",
          textAlign: "center",
          padding: "16px",
        }}
      >
        &copy; 2025 SingScape. Created by Group FDAC - SC2006.
      </footer>
    </div>
  );
}
