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
  CircularProgress,
  Snackbar,
  Alert,
  Link,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import Navbar from "../Components/Navbar";

const ManagePartnersScreen = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [editedPartner, setEditedPartner] = useState({});
  const [newPartner, setNewPartner] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    website: "",
    partnershipType: "",
    status: "",
  });
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://0.0.0.0:8081/partners", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch partners");

        const data = await response.json();
        setPartners(data);
      } catch (error) {
        console.error("Error loading partners:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const handleEditPartner = (partner) => {
    setEditingPartnerId(partner.id);
    setEditedPartner(partner);
  };

  const handleCancelEdit = () => {
    setEditingPartnerId(null);
    setEditedPartner({});
  };

  const handleSavePartner = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://0.0.0.0:8081/partners", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedPartner),
      });

      if (!response.ok) throw new Error("Failed to save partner");

      setPartners((prev) =>
        prev.map((p) => (p.id === editedPartner.id ? editedPartner : p))
      );
      setToastMessage("Partner updated successfully.");
      setEditingPartnerId(null);
      setEditedPartner({});
    } catch (error) {
      console.error("Save error:", error);
      setToastMessage("Failed to update partner.");
    }
  };

  const handleDeletePartner = async (partnerId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://0.0.0.0:8081/partners/${partnerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete partner");

      setPartners((prev) => prev.filter((p) => p.id !== partnerId));
      setToastMessage("Partner deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error);
      setToastMessage("Failed to delete partner.");
    }
  };

  const handleAddPartner = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://0.0.0.0:8081/partners", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPartner),
      });

      if (!response.ok) throw new Error("Failed to add partner");

      const savedPartner = await response.json();
      setPartners((prev) => [...prev, savedPartner]);
      setToastMessage("New partner added.");
      setNewPartner({
        name: "",
        organization: "",
        email: "",
        phone: "",
        website: "",
        partnershipType: "",
        status: "",
      });
    } catch (error) {
      console.error("Add error:", error);
      setToastMessage("Failed to add partner.");
    }
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 5, flexGrow: 1 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Manage Partners
        </Typography>
        <Box mt={4} mb={2}>
          <Typography variant="h6" gutterBottom>
            Add New Partner
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <TextField
              label="Name"
              size="small"
              value={newPartner.name}
              onChange={(e) =>
                setNewPartner({ ...newPartner, name: e.target.value })
              }
            />
            <TextField
              label="Organization"
              size="small"
              value={newPartner.organization}
              onChange={(e) =>
                setNewPartner({ ...newPartner, organization: e.target.value })
              }
            />
            <TextField
              label="Email"
              size="small"
              value={newPartner.email}
              onChange={(e) =>
                setNewPartner({ ...newPartner, email: e.target.value })
              }
            />
            <TextField
              label="Phone"
              size="small"
              value={newPartner.phone}
              onChange={(e) =>
                setNewPartner({ ...newPartner, phone: e.target.value })
              }
            />
            <TextField
              label="Website"
              size="small"
              value={newPartner.website}
              onChange={(e) =>
                setNewPartner({ ...newPartner, website: e.target.value })
              }
            />
            <TextField
              label="Partnership Type"
              size="small"
              value={newPartner.partnershipType}
              onChange={(e) =>
                setNewPartner({
                  ...newPartner,
                  partnershipType: e.target.value,
                })
              }
            />
            <TextField
              label="Status"
              size="small"
              value={newPartner.status}
              onChange={(e) =>
                setNewPartner({ ...newPartner, status: e.target.value })
              }
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPartner}
            >
              Add Partner
            </Button>
          </Stack>
        </Box>

        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
            <CircularProgress />
            <Typography mt={2}>Loading partners...</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Partner Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Organization</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Phone</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Website</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Type</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {partners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      {editingPartnerId === partner.id ? (
                        <TextField
                          value={editedPartner.name}
                          size="small"
                          onChange={(e) =>
                            setEditedPartner({
                              ...editedPartner,
                              name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        partner.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPartnerId === partner.id ? (
                        <TextField
                          value={editedPartner.organization}
                          size="small"
                          onChange={(e) =>
                            setEditedPartner({
                              ...editedPartner,
                              organization: e.target.value,
                            })
                          }
                        />
                      ) : (
                        partner.organization || "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPartnerId === partner.id ? (
                        <TextField
                          value={editedPartner.email}
                          size="small"
                          onChange={(e) =>
                            setEditedPartner({
                              ...editedPartner,
                              email: e.target.value,
                            })
                          }
                        />
                      ) : (
                        partner.email || "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPartnerId === partner.id ? (
                        <TextField
                          value={editedPartner.phone}
                          size="small"
                          onChange={(e) =>
                            setEditedPartner({
                              ...editedPartner,
                              phone: e.target.value,
                            })
                          }
                        />
                      ) : (
                        partner.phone || "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPartnerId === partner.id ? (
                        <TextField
                          value={editedPartner.website}
                          size="small"
                          onChange={(e) =>
                            setEditedPartner({
                              ...editedPartner,
                              website: e.target.value,
                            })
                          }
                        />
                      ) : partner.website ? (
                        <Link href={partner.website} target="_blank">
                          {partner.website}
                        </Link>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPartnerId === partner.id ? (
                        <TextField
                          value={editedPartner.partnershipType}
                          size="small"
                          onChange={(e) =>
                            setEditedPartner({
                              ...editedPartner,
                              partnershipType: e.target.value,
                            })
                          }
                        />
                      ) : (
                        partner.partnershipType
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPartnerId === partner.id ? (
                        <TextField
                          value={editedPartner.status}
                          size="small"
                          onChange={(e) =>
                            setEditedPartner({
                              ...editedPartner,
                              status: e.target.value,
                            })
                          }
                        />
                      ) : (
                        partner.status
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPartnerId === partner.id ? (
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={handleSavePartner}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            onClick={() => handleEditPartner(partner)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeletePartner(partner.id)}
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

export default ManagePartnersScreen;
