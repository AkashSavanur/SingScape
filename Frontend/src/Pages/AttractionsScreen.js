import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Box,
  Rating,
  Stack,
  Divider,
} from "@mui/material";
import supabase from "../helper/SupabaseClient";
import Swal from "sweetalert2";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

export default function AttractionsScreen() {
  const { attractionId } = useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [attraction, setAttraction] = useState(null);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [authUser, setAuthUser] = useState(null); // Supabase user
  const [profile, setProfile] = useState(null); // Custom user profile
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReviewText, setEditedReviewText] = useState("");

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setAuthUser(user);

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
            const profileData = await res.json();
            console.log(profileData);
            setProfile(profileData);
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
  const fetchAttractionData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://0.0.0.0:8081/attractions/${attractionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setAttraction(data);
      setSubmittedReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching attraction data:", error);
    }
  };
  useEffect(() => {
    fetchAttractionData();
  }, [attractionId]);
  const fetchAttractionReviews = async () => {
    if (!attraction?.id) return;

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://0.0.0.0:8081/reviews/attraction/${attractionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setSubmittedReviews(data);
    } catch (error) {
      console.error("Error fetching attraction reviews:", error);
    }
  };
  useEffect(() => {
    fetchAttractionReviews();
  }, [attraction]);

  useEffect(() => {
    const today = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(today.getMonth() + 1);
    const formatDate = (date) => date.toISOString().split("T")[0];

    setMinDate(formatDate(today));
    setMaxDate(formatDate(oneMonthLater));
  }, []);

  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `http://0.0.0.0:8081/ticket-types/${attractionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setTicketTypes(data);

        // Initialize selectedTickets state with 0 quantity per type
        const initialSelection = {};
        data.forEach((ticket) => {
          initialSelection[ticket.id] = 0;
        });
        setSelectedTickets(initialSelection);
      } catch (error) {
        console.error("Error fetching ticket types:", error);
      }
    };

    fetchTicketTypes();
  }, [attractionId]);

  const totalTickets = Object.values(selectedTickets).reduce(
    (sum, val) => sum + val,
    0
  );
  const totalPrice = ticketTypes.reduce((sum, ticket) => {
    const quantity = selectedTickets[ticket.id] || 0;
    return sum + quantity * parseFloat(ticket.price);
  }, 0);

  const handleBooking = async () => {
    const totalTickets = Object.values(selectedTickets).reduce(
      (sum, val) => sum + val,
      0
    );

    if (!selectedDate || totalTickets === 0) {
      alert("Please select a date and at least one ticket before proceeding.");
      return;
    }

    const exceedsQuantity = ticketTypes.some((ticket) => {
      const selected = selectedTickets[ticket.id] || 0;
      return selected > ticket.quantity;
    });
    
    if (exceedsQuantity) {
      alert("You've selected more tickets than available for one or more types.");
      return;
    }
    

    const customerName = profile.full_name;
    const email = profile.email;

    const ticketRequests = ticketTypes
      .filter((ticket) => selectedTickets[ticket.id] > 0)
      .map((ticket) => ({
        attractionId: ticket.attraction.id,
        type: ticket.type,
        price: ticket.price,
        date: selectedDate,
        ticketCount: selectedTickets[ticket.id],
      }));

    const bookingData = {
      customerName,
      email,
      ticketRequests,
    };

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://0.0.0.0:8081/booking/confirm", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const bookingId = await response.json();
        console.log("Booking successful:", bookingId);

        navigate("/payment", {
          state: {
            bookingId: bookingId,
            userId: profile.id,
            totalPrice,
          },
        });
      } else {
        const errorText = await response.text();
        console.error("Booking failed:", errorText);
        alert("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during booking:", error);
      alert("An unexpected error occurred during booking.");
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewText || reviewRating < 1) {
      alert("Please enter both a rating and a review comment.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const newReview = {
      text: reviewText,
      rating: reviewRating,
      flagged: false,
      attraction: {
        id: attraction.id,
      },
      user: {
        id: user.id,
      },
    };

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://0.0.0.0:8081/reviews", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        const savedReview = await response.json();
        setSubmittedReviews((prev) => [...prev, savedReview]);
        setReviewText("");
        setReviewRating(0);
      } else {
        const errorText = await response.text();
        console.error("Failed to submit review", response.status, errorText);
        alert("Error submitting review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An unexpected error occurred.");
    }
    fetchAttractionData();
    fetchAttractionReviews();
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setEditedReviewText(review.text);
  };

  const handleSaveReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://0.0.0.0:8081/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: editedReviewText }),
      });

      if (response.ok) {
        setSubmittedReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, text: editedReviewText } : r
          )
        );
        setEditingReviewId(null);
        setEditedReviewText("");
      } else {
        alert("Failed to update review.");
      }
    } catch (err) {
      console.error("Error updating review:", err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const confirm = await Swal.fire({
      title: "Delete Review?",
      text: "Are you sure you want to delete this review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `http://0.0.0.0:8081/reviews/${reviewId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          setSubmittedReviews((prev) => prev.filter((r) => r.id !== reviewId));
        } else {
          alert("Failed to delete review.");
        }
      } catch (err) {
        console.error("Error deleting review:", err);
      }
    }
    fetchAttractionData();
  };

  if (!attraction) return <p>Loading...</p>;

  const imageSrc = `/Images/${attraction.name}.jpeg`;

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flex={1}
        sx={{
          flex: 1,
          padding: "24px",
          backgroundColor: "#f4f4f4",
          overflowY: "auto",
        }}
      >
        <Card sx={{ width: "80%", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
          <CardMedia
            component="img"
            height="400"
            image={imageSrc}
            alt={attraction.name}
          />
          <CardContent>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Box flex={1} minWidth="300px">
                <Typography variant="h5" fontWeight="bold">
                  {attraction.name}
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ margin: "8px 0" }}
                >
                  {attraction.description}
                </Typography>
                <Typography variant="body2">
                  <strong>Type:</strong> {attraction.type}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">
                    <strong>Location:</strong> {attraction.location}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      attraction.location
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textTransform: "none", fontSize: "0.75rem" }}
                    startIcon={<LocationOnIcon />}
                  >
                    View on Map
                  </Button>
                </Box>
                <Typography variant="body2">
                  <strong>Postal:</strong> {attraction.postal}
                </Typography>
                <Typography variant="body2">
                  <strong>Rating:</strong> ⭐ {attraction.rating?.toFixed(2)}
                </Typography>
              </Box>

              <Box flexShrink={0} display="flex" flexDirection="column" gap={1}>
                <Typography variant="h6" sx={{ marginBottom: "8px" }}>
                  <strong>Facilities Nearby</strong>
                </Typography>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => {
                    navigate("/hawker-centres", {
                      state: { postalCode: attraction.postal },
                    });
                  }}
                  startIcon = {<RestaurantIcon />}
                >
                  Hawker Centres
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => {
                    navigate("/nearby-healthcare", {
                      state: { postalCode: attraction.postal },
                    });
                  }}
                  startIcon = {<LocalHospitalIcon />}
                >
                  Clinics/Hospitals
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => {
                    navigate("/nearby-atms", {
                      state: { postalCode: attraction.postal },
                    });
                  }}
                  startIcon = {<LocalAtmIcon />}
                >
                  ATMs
                </Button>
              </Box>
            </Box>

            <Typography variant="h6" sx={{ marginTop: "24px" }}>
              Select Date:
            </Typography>
            <TextField
              type="date"
              fullWidth
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              inputProps={{
                min: minDate,
                max: maxDate,
              }}
              sx={{ marginTop: "8px" }}
            />

            <Typography variant="h6" sx={{ marginTop: "24px" }}>
              Available Tickets:
            </Typography>

            {ticketTypes
              .filter((ticket) => ticket.quantity > 0)
              .map((ticket) => (
                <Card key={ticket.id} sx={{ mt: 2, padding: 2 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {ticket.type} Ticket
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Price: ${ticket.price}
                      </Typography>
                      <Typography variant="body2">
                        Selected: {selectedTickets[ticket.id] || 0}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() =>
                          setSelectedTickets((prev) => ({
                            ...prev,
                            [ticket.id]: Math.max(
                              (prev[ticket.id] || 0) - 1,
                              0
                            ),
                          }))
                        }
                      >
                        -
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "green", color: "white" }}
                        onClick={() =>
                          setSelectedTickets((prev) => ({
                            ...prev,
                            [ticket.id]: (prev[ticket.id] || 0) + 1,
                          }))
                        }
                      >
                        +
                      </Button>
                    </Box>
                  </Box>
                </Card>
              ))}

            {totalPrice > 0 && (
              <Typography variant="h6" sx={{ marginTop: "16px" }}>
                Total Price: ${totalPrice.toFixed(2)}
              </Typography>
            )}

            <Button
              variant="contained"
              color="success"
              width="90%"
              sx={{ marginTop: "16px" }}
              onClick={handleBooking}
            >
              Book Tickets
            </Button>

            <Typography variant="h6" sx={{ marginTop: "24px" }}>
              Reviews:
            </Typography>
            {submittedReviews.map((review, index) => {
              const isOwnReview = review.user?.id === authUser?.id;

              return (
                <>
                  <Box key={index} sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>{review.user?.full_name || "Anonymous"}:</strong>
                    </Typography>

                    {editingReviewId === review.id ? (
                      <Box>
                        <TextField
                          fullWidth
                          multiline
                          value={editedReviewText}
                          onChange={(e) => setEditedReviewText(e.target.value)}
                          rows={2}
                          sx={{ mt: 1 }}
                        />
                        <Box display="flex" gap={1} mt={1}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleSaveReview(review.id)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setEditingReviewId(null);
                              setEditedReviewText("");
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="body2" color="textSecondary">
                          {review.flagged ? "⚠️ (Flagged) " : ""}
                          {review.text}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {review.flagged ? "⚠️ (Flagged) " : ""}⭐{" "}
                          {review.rating}
                        </Typography>
                        {isOwnReview && (
                          <Box display="flex" gap={1} mt={1}>
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => handleEditReview(review)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              variant="text"
                              color="error"
                              onClick={() => handleDeleteReview(review.id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                  {index !== submittedReviews.length - 1 && (
                    <Box my={2}>
                      <Divider />
                    </Box>
                  )}
                </>
              );
            })}

            {/* Submit Review */}
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
