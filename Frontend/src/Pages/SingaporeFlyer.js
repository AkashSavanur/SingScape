import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  TextField,
  Rating
} from "@mui/material";

const singaporeFlyerData = {
  id: 4,
  name: "Singapore Flyer",
  description: "One of the world's largest observation wheels, offering breathtaking views of Singapore.",
  image: "/Images/flyer.jpg", 
  rating: 4.6,
  price: 40,
  availability: [
    { date: "2025-03-16", slots: [{ time: "6:00 PM", spots: 15 }, { time: "8:00 PM", spots: 5 }] },
    { date: "2025-03-17", slots: [{ time: "7:30 PM", spots: 10 }, { time: "9:00 PM", spots: 4 }] },
  ],
  reviews: [
    { user: "Sophia", rating: 5, comment: "Amazing night views, a must-visit in Singapore!" },
    { user: "Liam", rating: 4, comment: "Very scenic, but the waiting time can be long." },
  ],
};

export default function SingaporeFlyerScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [submittedReviews, setSubmittedReviews] = useState([...singaporeFlyerData.reviews]);
  const navigate = useNavigate();

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time slot before proceeding.");
      return;
    }
    alert(`Booking confirmed for Singapore Flyer on ${selectedDate} at ${selectedTime}`);
    navigate("/payment"); 
  };

  const handleSubmitReview = () => {
    if (!reviewText || reviewRating === 0) {
      alert("Please enter both a rating and a review comment.");
      return;
    }

    const newReview = {
      user: "You",
      rating: reviewRating,
      comment: reviewText,
    };

    setSubmittedReviews([...submittedReviews, newReview]);
    setReviewText("");
    setReviewRating(0);
  };

  const availableSlots = singaporeFlyerData.availability.find((d) => d.date === selectedDate)?.slots || [];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flex={1}
        sx={{ flex: 1, padding: "24px", backgroundColor: "#f4f4f4", overflowY: "auto" }}
      >
        <Card sx={{ width: "80%", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
          <CardMedia component="img" height="400" image={singaporeFlyerData.image} alt={singaporeFlyerData.name} />
          <CardContent>
            <Typography variant="h5" fontWeight="bold">{singaporeFlyerData.name}</Typography>
            <Typography variant="body1" color="textSecondary" sx={{ margin: "8px 0" }}>
              {singaporeFlyerData.description}
            </Typography>
            <Typography variant="body2"><strong>Price:</strong> ${singaporeFlyerData.price}</Typography>
            <Typography variant="body2"><strong>Rating:</strong> ⭐ {singaporeFlyerData.rating}</Typography>

            <FormControl fullWidth variant="outlined" sx={{ marginTop: "16px" }}>
              <InputLabel>Select Date</InputLabel>
              <Select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} label="Select Date">
                {singaporeFlyerData.availability.map((d) => (
                  <MenuItem key={d.date} value={d.date}>{d.date}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ marginTop: "16px" }} disabled={!selectedDate}>
              <InputLabel>Select Time Slot</InputLabel>
              <Select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} label="Select Time Slot">
                {availableSlots.map((slot) => (
                  <MenuItem key={slot.time} value={slot.time}>{slot.time} ({slot.spots} spots left)</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: "16px" }}
              onClick={handleBooking}
            >
              Confirm Booking
            </Button>

            <Typography variant="h6" sx={{ marginTop: "24px" }}>Reviews:</Typography>
            {submittedReviews.map((review, index) => (
              <Typography key={index} variant="body2" sx={{ marginTop: "8px" }}>
                <strong>{review.user}:</strong> ⭐ {review.rating} - {review.comment}
              </Typography>
            ))}

            <Box sx={{ marginTop: "24px" }}>
              <Typography variant="h6">Leave a Review:</Typography>
              <Rating
                name="user-rating"
                value={reviewRating}
                onChange={(event, newValue) => setReviewRating(newValue)}
              />
              <TextField
                label="Your review"
                multiline
                fullWidth
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                sx={{ marginTop: "8px" }}
              />
              <Button
                variant="contained"
                color="secondary"
                sx={{ marginTop: "8px" }}
                onClick={handleSubmitReview}
              >
                Submit Review
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}
