import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../helper/SupabaseClient";
import Swal from "sweetalert2";

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
            console.log("data" + profileData.is_admin)
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
      Swal.fire("Signed out!", "You have been successfully signed out.", "success");
      navigate("/login");
    }
  };

  return (
    <header
      style={{
        position: "sticky",
        backgroundColor: "#fff",
        color: "black",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        fontSize: "32px",
        fontWeight: "bold",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <span onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
        SingScape
      </span>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {profile?.is_admin && (
          <button style={buttonStyle} onClick={() => navigate("/admin")}>
            Admin
          </button>
        )}

        <button style={buttonStyle} onClick={() => navigate("/customer-support")}>
          Customer Support
        </button>

        {authUser ? (
          <>
            <button
              style={filledButtonStyle}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "black")}
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
            <button style={buttonStyle} onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button style={buttonStyle} onClick={() => navigate("/login")}>
              Login
            </button>
            <button
              style={filledButtonStyle}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "black")}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

const buttonStyle = {
  backgroundColor: "transparent",
  border: "2px solid black",
  padding: "8px 16px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  borderRadius: "5px",
  transition: "all 0.3s ease",
  color: "black",
};

const filledButtonStyle = {
  backgroundColor: "black",
  color: "white",
  border: "none",
  padding: "8px 16px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  borderRadius: "5px",
  transition: "all 0.3s ease",
};

export default Navbar;
