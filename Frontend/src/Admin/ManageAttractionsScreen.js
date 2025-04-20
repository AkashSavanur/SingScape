import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import Navbar from "../Components/Navbar";
import Swal from "sweetalert2";

const ManageAttractionsScreen = () => {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAttractionId, setEditingAttractionId] = useState(null);
  const [editedAttraction, setEditedAttraction] = useState({});
  const [newAttraction, setNewAttraction] = useState({
    name: "",
    type: "",
    location: "",
    postal: "",
    rating: "",
    description: "",
  });

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("http://0.0.0.0:8081/attractions", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch attractions");
        const data = await res.json();
        setAttractions(data);
      } catch (err) {
        console.error("Error fetching attractions:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Attraction?",
      text: "Are you sure you want to delete this attraction?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`http://0.0.0.0:8081/attractions/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status == "302") {
          setAttractions((prev) => prev.filter((attr) => attr.id !== id));
          Swal.fire("Deleted!", "The attraction has been removed.", "success");
        } else {
          Swal.fire("Failed!", "Could not delete attraction.", "error");
        }
      } catch (err) {
        console.error("Error deleting attraction:", err.message);
        Swal.fire("Error", "Something went wrong.", "error");
      }
    }
  };

  const handleEdit = (attraction) => {
    setEditingAttractionId(attraction.id);
    setEditedAttraction({ ...attraction });
  };

  const handleCancelEdit = () => {
    setEditingAttractionId(null);
    setEditedAttraction({});
  };

  const handleSave = async () => {
    // --- quick required‑field guard ---
    const required = ["name", "type", "location", "postal", "description"];
    const missing = required.find((k) => !editedAttraction[k]);
    if (missing) {
      Swal.fire("Error", `Attraction ${missing} is a required field`, "error");
      return;
    }
  
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `http://0.0.0.0:8081/attractions/update/${editingAttractionId}`, // <-- keep your path
        {
          method: "PUT",                    // or PATCH if your API says so
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedAttraction),
        }
      );
  
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
  
      // ── try to parse JSON only if there is a body ──────────────────────────────
      let updated = editedAttraction;       // fallback
      const hasBody =
        res.headers.get("content-type")?.includes("application/json") &&
        res.headers.get("content-length") !== "0" &&
        res.status !== 204;
  
      if (hasBody) {
        updated = await res.json();
      }
  
      // ── update local state ─────────────────────────────────────────────────────
      setAttractions((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
  
      setEditingAttractionId(null);
      setEditedAttraction({});
      Swal.fire("Updated!", "Attraction updated successfully.", "success");
    } catch (err) {
      console.error("Save error:", err.message);
      Swal.fire("Error", "Could not save changes.", "error");
    }
  };
  

  const handleAddAttraction = async () => {
    if (!newAttraction.name) {
      Swal.fire("Error", "Attraction name is a required field", "error");
      return;
    }
    if (!newAttraction.type) {
      Swal.fire("Error", "Attraction type is a required field", "error");
      return;
    }
    if (!newAttraction.location) {
      Swal.fire("Error", "Attraction location is a required field", "error");
      return;
    }
    if (!newAttraction.postal) {
      Swal.fire("Error", "Attraction postal code is a required field", "error");
      return;
    }
    if (!newAttraction.description) {
      Swal.fire("Error", "Attraction description is a required field", "error");
      return;
    }
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://0.0.0.0:8081/attractions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAttraction),
      });

      if (!res.ok) throw new Error("Failed to add");

      const data = await res.json();
      setAttractions((prev) => [...prev, data]);
      setNewAttraction({
        name: "",
        type: "",
        location: "",
        postal: "",
        rating: "",
        description: "",
      });
      Swal.fire("Added!", "Attraction added successfully", "success");
    } catch (err) {
      console.error("Add error:", err.message);
      Swal.fire("Error", "Could not add attraction.", "error");
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <main style={{ flex: 1, padding: "24px", backgroundColor: "#f4f4f4" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Manage Attractions
          </Typography>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6">Add New Attraction</Typography>
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              useFlexGap
              mt={2}
            >
              <TextField
                label="Name"
                size="small"
                value={newAttraction.name}
                onChange={(e) =>
                  setNewAttraction({ ...newAttraction, name: e.target.value })
                }
              />
              <TextField
                label="Type"
                size="small"
                value={newAttraction.type}
                onChange={(e) =>
                  setNewAttraction({ ...newAttraction, type: e.target.value })
                }
              />
              <TextField
                label="Location"
                size="small"
                value={newAttraction.location}
                onChange={(e) =>
                  setNewAttraction({
                    ...newAttraction,
                    location: e.target.value,
                  })
                }
              />
              <TextField
                label="Postal"
                size="small"
                value={newAttraction.postal}
                onChange={(e) =>
                  setNewAttraction({ ...newAttraction, postal: e.target.value })
                }
              />
              <TextField
                label="Description"
                size="small"
                value={newAttraction.description}
                onChange={(e) =>
                  setNewAttraction({
                    ...newAttraction,
                    description: e.target.value,
                  })
                }
              />
              <Button variant="contained" onClick={handleAddAttraction}>
                Add Attraction
              </Button>
            </Stack>
          </Paper>

          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "40px",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Type</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Location</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Postal</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Rating</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Description</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attractions.map((attraction) => (
                    <TableRow key={attraction.id}>
                      <TableCell>
                        {editingAttractionId === attraction.id ? (
                          <TextField
                            size="small"
                            value={editedAttraction.name}
                            onChange={(e) =>
                              setEditedAttraction({
                                ...editedAttraction,
                                name: e.target.value,
                              })
                            }
                          />
                        ) : (
                          attraction.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingAttractionId === attraction.id ? (
                          <TextField
                            size="small"
                            value={editedAttraction.type}
                            onChange={(e) =>
                              setEditedAttraction({
                                ...editedAttraction,
                                type: e.target.value,
                              })
                            }
                          />
                        ) : (
                          attraction.type
                        )}
                      </TableCell>
                      <TableCell>
                        {editingAttractionId === attraction.id ? (
                          <TextField
                            size="small"
                            value={editedAttraction.location}
                            onChange={(e) =>
                              setEditedAttraction({
                                ...editedAttraction,
                                location: e.target.value,
                              })
                            }
                          />
                        ) : (
                          attraction.location
                        )}
                      </TableCell>
                      <TableCell>
                        {editingAttractionId === attraction.id ? (
                          <TextField
                            size="small"
                            value={editedAttraction.postal}
                            onChange={(e) =>
                              setEditedAttraction({
                                ...editedAttraction,
                                postal: e.target.value,
                              })
                            }
                          />
                        ) : (
                          attraction.postal
                        )}
                      </TableCell>
                      <TableCell>
                        {editingAttractionId === attraction.id ? (
                          <TextField
                            size="small"
                            value={editedAttraction.rating}
                            onChange={(e) =>
                              setEditedAttraction({
                                ...editedAttraction,
                                rating: e.target.value,
                              })
                            }
                          />
                        ) : (
                          attraction.rating
                        )}
                      </TableCell>
                      <TableCell>
                        {editingAttractionId === attraction.id ? (
                          <TextField
                            size="small"
                            value={editedAttraction.description}
                            onChange={(e) =>
                              setEditedAttraction({
                                ...editedAttraction,
                                description: e.target.value,
                              })
                            }
                          />
                        ) : (
                          attraction.description
                        )}
                      </TableCell>
                      <TableCell>
                        {editingAttractionId === attraction.id ? (
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={handleSave}
                            >
                              Save
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                          </Stack>
                        ) : (
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => handleEdit(attraction)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleDelete(attraction.id)}
                            >
                              Delete
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
      </main>
      <footer
        style={{
          backgroundColor: "#00002a",
          color: "white",
          textAlign: "center",
          padding: "16px",
          fontSize: "14px",
        }}
      >
        &copy; 2025 SingScape. Created by Group FDAC - SC2006.
      </footer>
    </div>
  );
};

export default ManageAttractionsScreen;
