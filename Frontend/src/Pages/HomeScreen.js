import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import AttractionCard from "../Components/AttractionCard";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Box,
} from "@mui/material";
import axios from "axios";
import supabase from "../helper/SupabaseClient";
import { Pagination } from "@mui/material";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("None");
  const [attractionsData, setAttractionsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const attractionsPerPage = 8;

  const CATEGORY_GROUPS = {
    "All": [],
    "Nature": ["Park", "Nature Reserve", "Nature Trail", "Garden"],
    "Museums & Education": ["Museum", "Science Museum"],
    "Entertainment": ["Theme Park", "Aquarium", "Observation Wheel", "Entertainment District", "Wildlife Park"],
    "Cultural & Historical": ["Historical Hotel", "Landmark"],
    "Shopping & Food": ["Shopping and Leisure Complex", "Hawker Centre"],
  };

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://0.0.0.0:8081/attractions", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setAttractionsData(response.data);
      } catch (error) {
        console.error("Failed to fetch attractions:", error);
      }
    };

    fetchAttractions();
  }, []);

  useEffect(() => {
    const fetchUserAndCreateAccount = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const token = localStorage.getItem("access_token");

        const checkRes = await fetch(`http://0.0.0.0:8081/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (checkRes.status === 404) {
          const createRes = await fetch("http://0.0.0.0:8081/users", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: user.id,
              email: user.user_metadata.email,
              full_name: user.user_metadata.full_name,
              phone_number: user.user_metadata.phone_number,
              is_admin: false,
            }),
          });

          if (!createRes.ok) {
            const resJson = await createRes.json();
            console.error("Profile creation failed:", resJson.message);
          } else {
            console.log("Profile created successfully");
          }
        }
      } catch (err) {
        console.error("Error during profile check/creation:", err.message);
      }
    };

    fetchUserAndCreateAccount();
  }, []);

  const filteredAttractions = attractionsData.filter((attraction) => {
    const nameMatch = attraction.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch =
      selectedCategory === "All" ||
      CATEGORY_GROUPS[selectedCategory]?.includes(attraction.type);
    return nameMatch && categoryMatch;
  });

  const sortedAttractions = [...filteredAttractions].sort((a, b) => {
    if (sortBy === "Rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "Alphabetical") return a.name.localeCompare(b.name);
    if (sortBy === "-Alphabetical") return b.name.localeCompare(a.name);
    return 0;
  });

  const startIndex = (currentPage - 1) * attractionsPerPage;
  const paginatedAttractions = sortedAttractions.slice(
    startIndex,
    startIndex + attractionsPerPage
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "24px", backgroundColor: "#f4f4f4" }}>
        <Box display="flex" justifyContent="center" marginBottom="24px">
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            style={{ maxWidth: "800px" }}
          >
            <Grid item xs={12} sm={6}>
              <TextField
                label="Search attractions..."
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  {Object.keys(CATEGORY_GROUPS).map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort by"
                >
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Rating">Rating</MenuItem>
                  <MenuItem value="Alphabetical">A-Z</MenuItem>
                  <MenuItem value="-Alphabetical">Z-A</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            justifyContent: "center",
          }}
        >
          {paginatedAttractions.length > 0 ? (
            paginatedAttractions.map((attraction, index) => (
              <AttractionCard key={index} attraction={attraction} />
            ))
          ) : (
            <p style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
              No attractions found.
            </p>
          )}
        </div>
        {sortedAttractions.length > attractionsPerPage && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={Math.ceil(sortedAttractions.length / attractionsPerPage)}
              page={currentPage}
              onChange={(e, value) => setCurrentPage(value)}
              color="primary"
            />
          </Box>
        )}
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
}