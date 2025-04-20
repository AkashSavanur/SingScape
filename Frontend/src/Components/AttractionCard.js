import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import supabase from "../helper/SupabaseClient";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

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

  const [minPrice, setMinPrice] = useState(null);

  useEffect(() => {
    const fetchMinTicketPrice = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(
          `http://0.0.0.0:8081/ticket-types/${attraction.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const prices = data.map((ticket) => parseFloat(ticket.price));
          setMinPrice(Math.min(...prices).toFixed(2));
        }
      } catch (error) {
        console.error("Error fetching ticket prices:", error);
      }
    };

    fetchMinTicketPrice();
  }, [attraction.id]);

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
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={imageSrc}
        alt={attraction.name}
      />
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6" fontWeight="bold">
          {attraction.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" noWrap>
          {attraction.description}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Type:</strong> {attraction.type} | <strong>Location:</strong>{" "}
          {attraction.location}
        </Typography>
        <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
          Rating: ⭐ {attraction.rating?.toFixed(2)}
        </Typography>
        {minPrice && (
          <Typography
            variant="body1"
            color="secondary"
            fontWeight="bold"
            sx={{ mt: 1 }}
          >
            From ${minPrice}
          </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} /> {/* pushes button to bottom */}
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ mt: 1 }}
        >
          <Button
            color="primary"
            onClick={handleBooking}
            sx={{ alignSelf: "flex-end" }}
            aria-label="View Details"
            endIcon={<ArrowForwardIosIcon />}
          >
            View
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AttractionCard;
