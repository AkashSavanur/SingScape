import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Stack,
} from "@mui/material";
import Navbar from "../Components/Navbar";

const ManageUsersScreen = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://0.0.0.0:8081/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        console.log(data);
        setUsers(data);
      } catch (error) {
        console.error("Error loading users:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBanToggle = async (user) => {
    const updatedUser = { ...user, isBanned: !user.isBanned };

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://0.0.0.0:8081/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error("Failed to update user ban status");

      setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));

      const action = updatedUser.isBanned ? "banned" : "unbanned";
      setToastMessage(`User ${user.full_name} has been ${action}`);
    } catch (error) {
      console.error("Error updating user:", error);
      setToastMessage("Failed to update user status.");
    }
  };

  const handleEditUser = (user) => {
    setEditingUserId(user.id);
    setEditedUser({
      full_name: user.full_name,
      phone_number: user.phone_number,
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditedUser({});
  };

  const handleSaveEdit = async (user) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://0.0.0.0:8081/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...user, ...editedUser }),
      });

      if (!response.ok) throw new Error("Failed to update user");

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, ...editedUser } : u))
      );

      setToastMessage(`User ${editedUser.full_name} has been updated.`);
      setEditingUserId(null);
      setEditedUser({});
    } catch (error) {
      console.error("Error saving user:", error);
      setToastMessage("Failed to save user changes.");
    }
  };

  const handleBan = async (user) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`http://0.0.0.0:8081/users/ban/${user.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ banned: !user.banned }),
      });

      if (!response.ok) throw new Error("Failed to update user ban status");

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, banned: !user.banned } : u))
      );
      setToastMessage(
        `User ${user.full_name} has been ${
          !user.banned ? "banned" : "unbanned"
        }`
      );
    } catch (error) {
      console.error("Error banning user:", error.message);
      setToastMessage("Failed to update user ban status.");
    }
  };

  const handleViewBooking = async (user) => {
    navigate("/admin-bookings", {
      state: {
        userId: user.id,
      },
    });
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 5, flexGrow: 1 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Manage Users
        </Typography>

        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
            <CircularProgress />
            <Typography mt={2}>Loading users...</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Full Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Phone Number</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Bookings</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Admin</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {editingUserId === user.id ? (
                        <input
                          value={editedUser.full_name}
                          onChange={(e) =>
                            setEditedUser((prev) => ({
                              ...prev,
                              full_name: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        user.full_name
                      )}
                    </TableCell>
                    <TableCell>{user.email || "N/A"}</TableCell>
                    <TableCell>
                      {editingUserId === user.id ? (
                        <input
                          value={editedUser.phone_number || ""}
                          onChange={(e) =>
                            setEditedUser((prev) => ({
                              ...prev,
                              phone_number: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        user.phone_number || "N/A"
                      )}
                    </TableCell>
                    <TableCell>{user.bookingIds?.length || 0}</TableCell>
                    <TableCell>{user.is_admin ? "✅" : "❌"}</TableCell>
                    <TableCell>
                      {editingUserId === user.id ? (
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleSaveEdit(user)}
                          >
                            Save
                          </Button>
                          <Button variant="outlined" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleViewBooking(user)}
                          >
                            View Bookings
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant={user.banned ? "outlined" : "contained"}
                            color={user.banned ? "success" : "error"}
                            onClick={() => handleBan(user)}
                          >
                            {user.banned ? "Unban" : "Ban"}
                          </Button>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
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

export default ManageUsersScreen;
