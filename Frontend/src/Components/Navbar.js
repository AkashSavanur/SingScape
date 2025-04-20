import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../helper/SupabaseClient";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

const Navbar = () => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);

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

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null;
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
              setProfile(profileData);
            } else {
              setProfile(null);
            }
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be signed out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, sign me out",
    });

    if (result.isConfirmed) {
      await supabase.auth.signOut();
      setAuthUser(null);
      setProfile(null);
      localStorage.removeItem("access_token");
      Swal.fire("Signed out!", "You have been successfully signed out.", "success");
      navigate("/login");
    }
  };

  return (
    <header
      style={{
        position: "sticky",
        backgroundColor: "#00002a",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        fontSize: "32px",
        fontWeight: "bold",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      <span onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
        SingScape
      </span>

      <Box display="flex" gap={2} alignItems="center">
        {profile?.is_admin && (
          <HoverButton onClick={() => navigate("/admin")} icon={<AdminPanelSettingsIcon />} label="Admin" />
        )}

        <HoverButton onClick={() => navigate("/customer-support")} icon={<SupportAgentIcon />} label="Support" />

        {authUser ? (
          <>
            <HoverButton onClick={() => navigate("/profile")} icon={<AccountCircleIcon />} label="Profile" />
            <HoverButton onClick={handleSignOut} icon={<ExitToAppIcon />} label="Sign Out" />
          </>
        ) : (
          <>
            <HoverButton onClick={() => navigate("/login")} icon={<LoginIcon />} label="Login" />
            <HoverButton onClick={() => navigate("/signup")} icon={<AppRegistrationIcon />} label="Sign Up" />
          </>
        )}
      </Box>
    </header>
  );
};

// Reusable icon + hover text button
const HoverButton = ({ icon, label, onClick }) => (
  <Button
    onClick={onClick}
    startIcon={icon}
    sx={{
      color: "white",
      textTransform: "none",
      fontWeight: "bold",
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.1)",
      },
    }}
  >
    {label}
  </Button>
);


export default Navbar;
