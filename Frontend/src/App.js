import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "./helper/SupabaseClient";
import LandingScreen from "./Pages/LandingScreen";
import SignUpScreen from "./Pages/SignUpScreen";
import LoginScreen from "./Pages/LoginScreen";
import ForgotPasswordScreen from "./Pages/ForgotPasswordScreen";
import ResetPasswordScreen from "./Pages/ResetPasswordScreen";
import HomeScreen from "./Pages/HomeScreen";
import UniversalStudiosScreen from "./Pages/UniversalStudiosScreen";
import SingaporeZooScreen from "./Pages/SingaporeZooScreen";
import ArtScienceMuseumScreen from "./Pages/ArtScienceMusuemScreen";
import SingaporeFlyerScreen from "./Pages/SingaporeFlyer";
import CustomerSupport from "./Pages/CustomerSupport";
import AdminManagementScreen from "./Admin/AdminManagementScreen";
import ManageUsersScreen from "./Admin/ManageUsersScreen";
import ManageAttractionsScreen from "./Admin/ManageAttractionsScreen";
import ManagePartnerScreen from "./Admin/ManagePartnerScreen";
import ManageReviewScreen from "./Admin/ManageReviewScreen";
import ProfileScreen from "./Pages/ProfileScreen";
import PaymentScreen from "./Pages/PaymentScreen";
import AttractionsScreen from "./Pages/AttractionsScreen";
import Lottie from "lottie-react";
import aiLoadingAnimation from "./assets/ai-loader.json";
import BookingsScreen from "./Pages/BookingsScreen";
import HawkerCentreScreen from "./Pages/HawkerCentreScreen";
import ClinicScreen from "./Pages/ClinicScreen";
import ATMScreen from "./Pages/ATMScreen";
import UserBookingsScreen from "./Admin/UserBookingsScreen"

function ProtectedRoute({ element }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", 
          width: "100vw", 
        }}
      >
        <Lottie
          animationData={aiLoadingAnimation}
          loop={true}
          style={{ width: 300 }}
        />
      </div>
    );

  return user ? element : <Navigate to="/login" replace />;
}



function AdminRoute({ element }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const token = localStorage.getItem("access_token");
          const res = await fetch(`http://0.0.0.0:8081/users/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (res.ok) {
            const profile = await res.json();
            setUser(user);
            setIsAdmin(profile.is_admin === true);
          }
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Lottie
          animationData={aiLoadingAnimation}
          loop={true}
          style={{ width: 300 }}
        />
      </div>
    );
  }

  // If user is not an admin or not logged in, redirect to homepage
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and admin, show the route element
  return element;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/reset-password" element={<ResetPasswordScreen />} />
        <Route
          path="/home"
          element={<ProtectedRoute element={<HomeScreen />} />}
        />
        <Route
          path="/attraction/:attractionId"
          element={<AttractionsScreen />}
        />
        <Route
          path="/hawker-centres"
          element={<HawkerCentreScreen />}
        />
        <Route
          path="/nearby-healthcare"
          element={<ClinicScreen />}
        />
        <Route
          path="/nearby-atms"
          element={<ATMScreen />}
        />
        <Route
          path="/customer-support"
          element={<ProtectedRoute element={<CustomerSupport />} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<ProfileScreen />} />}
        />
        <Route
          path="/bookings"
          element={<ProtectedRoute element={<BookingsScreen />} />}
        />
        <Route
          path="/payment"
          element={<ProtectedRoute element={<PaymentScreen />} />}
        />
        <Route
          path="/admin"
          element={<AdminRoute element={<AdminManagementScreen />} />}
        />
        <Route
          path="/admin/manage-user"
          element={<AdminRoute element={<ManageUsersScreen />} />}
        />
        <Route
          path="/admin/manage-attraction"
          element={<AdminRoute element={<ManageAttractionsScreen />} />}
        />
        <Route
          path="/admin/manage-partner"
          element={<AdminRoute element={<ManagePartnerScreen />} />}
        />
        <Route
          path="/admin/manage-review"
          element={<AdminRoute element={<ManageReviewScreen />} />}
        />
        <Route
          path="/admin-bookings"
          element={<AdminRoute element={<UserBookingsScreen />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
