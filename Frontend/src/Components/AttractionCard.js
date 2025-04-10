import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import supabase from "../helper/SupabaseClient";

const AttractionCard = ({ attraction }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id) {
        try {
          const token = localStorage.getItem("access_token");
          const res = await fetch(`http://0.0.0.0:8081/users/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (res.ok) {
            const profile = await res.json();
            setIsAdmin(profile.is_admin);
          } else {
            console.error("Failed to fetch user profile");
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleBooking = () => {
    navigate(`/attraction/${attraction.id}`);
  };

  const imageSrc = `/Images/${attraction.name}.jpeg`;

  return (
    <Card
      sx={{
        width: 300,
        height: 400, 
        margin: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <CardMedia component="img" height="140" image={imageSrc} alt={attraction.name} />
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" fontWeight="bold">
          {attraction.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" noWrap>
          {attraction.description}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Type:</strong> {attraction.type} | <strong>Location:</strong> {attraction.location}
        </Typography>
        <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
          Rating: ⭐ {attraction.rating?.toFixed(2)}
        </Typography>

        <Box sx={{ flexGrow: 1 }} /> {/* pushes button to bottom */}

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          fullWidth
          onClick={handleBooking}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default AttractionCard;
