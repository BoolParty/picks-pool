import React from 'react';
import { auth } from "./firebase";
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import './Account.css'; // Custom CSS for Account page

const Account = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert("Signed out successfully!");
      navigate("/"); // Redirect to the home page
    } catch (err) {
      console.error("Error signing out:", err.message);
    }
  };

  return (
    <div className="account-container">
      <h1>My Account</h1>
      <ul className="account-menu">
      <li>
          <button className="account-menu-button" onClick={() => navigate("/userprofile")}>
            Account Details
          </button>
        </li>
        <li>
          <button className="account-menu-button" onClick={() => navigate("/matchedpicks")}>
            Matched Picks
          </button>
        </li>
        <li>
          <button className="account-menu-button" onClick={() => navigate("/unmatchedpicks")}>
            Unmatched Picks
          </button>
        </li>
        <li>
          <button className="sign-out-button" onClick={handleSignOut}>
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Account;