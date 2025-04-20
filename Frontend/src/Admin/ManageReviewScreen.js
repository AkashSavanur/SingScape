import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Navbar from "../Components/Navbar";
import Swal from "sweetalert2";

const ManageReviewScreen = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://0.0.0.0:8081/reviews", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error loading reviews:", error.message);
        setToastMessage("Error loading reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleFlag = async (id, currentFlag) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://0.0.0.0:8081/reviews/${id}/flag`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ flagged: !currentFlag }),
        }
      );

      if (!response.ok) throw new Error("Failed to flag review");

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, flagged: !r.flagged } : r))
      );

      Swal.fire("Success", `Review ${!currentFlag ? "flagged" : "unflagged"} successfully.`, "success");
    } catch (error) {
      console.error(error.message);
      setToastMessage("Failed to update flag status.");
    }
  };

  const handleDelete = async (id) => {
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
        const res = await fetch(`http://0.0.0.0:8081/reviews/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          setReviews((prev) => prev.filter((rev) => rev.id !== id));
          Swal.fire("Deleted!", "The review has been removed.", "success");
        } else {
          Swal.fire("Failed!", "Could not delete review.", "error");
        }
      } catch (err) {
        console.error("Error deleting review:", err.message);
        Swal.fire("Error", "Something went wrong.", "error");
      }
    }
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 5, flexGrow: 1 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Manage Reviews
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : reviews.length === 0 ? (
          <Typography>No reviews found.</Typography>
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Phone Number</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Attraction</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Review</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.user?.full_name || "N/A"}</TableCell>
                    <TableCell>{review.user?.email || "N/A"}</TableCell>
                    <TableCell>{review.user?.phone_number || "N/A"}</TableCell>
                    <TableCell>{review.attraction?.name || "N/A"}</TableCell>
                    <TableCell>
                      {review.text}
                      {review.flagged && (
                        <Typography
                          variant="caption"
                          color="error"
                          display="block"
                        >
                          ⚠️ Flagged
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          variant="outlined"
                          color={review.flagged ? "warning" : "primary"}
                          onClick={() => handleFlag(review.id, review.flagged)}
                        >
                          {review.flagged ? "Unflag" : "Flag"}
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(review.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Snackbar
          open={Boolean(toastMessage)}
          autoHideDuration={3000}
          onClose={() => setToastMessage("")}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="info" sx={{ width: "100%" }}>
            {toastMessage}
          </Alert>
        </Snackbar>
      </Container>

      <Box
        component="footer"
        sx={{
          backgroundColor: "#00002a",
          color: "white",
          textAlign: "center",
          py: 2,
          fontSize: 14,
        }}
      >
        &copy; 2025 SingScape. Created by Group FDAC - SC2006.
      </Box>
    </Box>
  );
};

export default ManageReviewScreen;
