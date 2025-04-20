import React, { useEffect, useState } from "react";
import { Paper, Box } from "@mui/material";
import supabase from "../helper/SupabaseClient";
import Navbar from "../Components/Navbar";
import { Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import aiLoadingAnimation from "../assets/ai-loader.json";
import Lottie from "lottie-react";
import { useLocation } from "react-router-dom";

export default function BookingsPage() {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const userId = location.state?.userId

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const bookingResponse = await fetch(
          `http://0.0.0.0:8081/booking/user/${userId}/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!bookingResponse.ok) throw new Error("Failed to fetch bookings");

        const bookingData = await bookingResponse.json();
        console.log("Bookings:", bookingData);
        setBookings(bookingData);
      } catch (err) {
        console.error("Error fetching bookings:", err.message);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <Box mt={4} p={4} sx={{ backgroundColor: "#fff", flex: 1 }}>
        <h2>Bookings</h2>
        {bookings.length === 0 ? (
          <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Lottie
            animationData={aiLoadingAnimation}
            loop={true}
            style={{ width: 300 }}
          />
        </div>
        ) : (
          [...bookings]
            .filter((booking) => booking.status === "CONFIRMED")
            .sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime))
            .map((booking, index) => (
              <Paper
                key={index}
                style={{ margin: "12px 0", padding: "16px" }}
                elevation={1}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  gap={2}
                >
                  <Box flex={1}>
                    <p>
                      <strong>Attraction:</strong> {booking.attractionName}
                    </p>
                    <p>
                      <strong>Booking Time:</strong>{" "}
                      {new Date(booking.bookingTime).toLocaleString()}
                    </p>
                    <p>
                      <strong>Total Tickets:</strong> {booking.ticketCount}
                    </p>
                    <p>
                      <strong>Total Price:</strong> ${booking.price}
                    </p>
                  </Box>

                  <img
                    src={`/Images/${booking.attractionName}.jpeg`}
                    alt={booking.attractionName}
                    style={{
                      width: "360px",
                      height: "240px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      flexShrink: 0,
                    }}
                    onClick={() => navigate(`/attraction/${booking.attraction}`)}
                  />
                </Box>

                <Box mt={3}>
                  <Divider sx={{ my: 2 }} />
                  <strong>Ticket Details:</strong>
                  {booking.tickets.map((ticket, i) => (
                    <Paper
                      key={i}
                      style={{
                        margin: "8px 0",
                        padding: "12px",
                        backgroundColor: "#f9f9f9",
                      }}
                      variant="outlined"
                    >
                      <p>
                        <strong>Type:</strong> {ticket.type}
                      </p>
                      <p>
                        <strong>Date:</strong> {ticket.date}
                      </p>
                      <p>
                        <strong>Price:</strong> ${ticket.price}
                      </p>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            ))
        )}
      </Box>
    </div>
  );
}
