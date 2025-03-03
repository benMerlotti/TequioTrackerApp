import React, { useEffect, useState } from "react";
import { AdminDashboard } from "./AdminDashboard";
import { AmbassadorDashboard } from "./AmbassadorDashboard"; // The component to show for non-admins

export const DashboardWrapper = ({ loggedInUser }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = loggedInUser; // Assume this returns user data with roles
      setUserRole(user.roles.includes("Admin") ? "Admin" : "User");
      setLoading(false); // Data fetching is complete
    };

    fetchUserRole();
  }, []);

  if (loading) {
    // Optional loading state
    return <div>Loading...</div>;
  }

  // Conditional rendering based on user role
  return (
    <div>
      {userRole === "Admin" ? (
        <AdminDashboard loggedInUser={loggedInUser} />
      ) : (
        <AmbassadorDashboard loggedInUser={loggedInUser} />
      )}
    </div>
  );
};
