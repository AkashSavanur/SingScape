import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import Navbar from "../Components/Navbar";
import Swal from "sweetalert2"; 

export default function PaymentScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingId = location.state?.bookingId[0];
  const userId = location.state?.userId;
  const totalPrice = location.state?.totalPrice || 0;
  const [token, setToken] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("VISA");

  useEffect(() => {
    if (!bookingId) {
      navigate("/");
    }
    setToken(localStorage.getItem("access_token"));
    console.log("Booking ID:", bookingId);
    console.log("User ID:", userId);
  }, [bookingId, navigate]);

  const handlePayment = async () => {
    if (!userId || !bookingId) {
      Swal.fire("Error", "Missing booking data. Cannot proceed with payment.", "error");
      return;
    }

    const paymentPayload = {
      userId,
      bookingId,
      method: paymentMethod,
      action: "confirm",
    };

    try {
      const res = await fetch("http://0.0.0.0:8081/payment/confirm", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentPayload),
      });

      if (res.ok) {
        Swal.fire({
          title: "Success",
          text: "Payment Successful! Your booking is confirmed.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        }).then(() => navigate("/bookings"));
      } else {
        const errorText = await res.text();
        console.error("Payment failed:", errorText);
        Swal.fire("Payment Failed", errorText || "Please try again.", "error");
      }
    } catch (error) {
      console.error("Error during payment:", error);
      Swal.fire("Error", "An unexpected error occurred during payment.", "error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box
        sx={{ flex: 1, p: 4, backgroundColor: "#f4f4f4" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Paper elevation={4} sx={{ padding: 4, width: "100%", maxWidth: 600 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Complete Your Payment
          </Typography>

          <Typography variant="body1" gutterBottom>
            Total Amount: <strong>${totalPrice.toFixed(2)}</strong>
          </Typography>

          <Divider sx={{ my: 2 }} />

          <FormControl component="fieldset">
            <Typography variant="h6" gutterBottom>
              Select Payment Method:
            </Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel value="VISA" control={<Radio />} label="VISA" />
              <FormControlLabel value="PAYNOW" control={<Radio />} label="PAYNOW" />
              <FormControlLabel value="PAYPAL" control={<Radio />} label="PAYPAL" />
            </RadioGroup>
          </FormControl>

          <Button
            variant="contained"
            color="success"
            sx={{ mt: 3 }}
            fullWidth
            onClick={handlePayment}
          >
            Confirm Payment
          </Button>
        </Paper>
      </Box>
    </div>
  );
}
