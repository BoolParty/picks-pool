import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';

function UserProfile() {
  const [userData, setUserData] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error messages

  const db = getFirestore(); // Firestore instance
  const user = auth.currentUser; // Current logged-in user

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            setError('User data not found.');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to fetch user data.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('No user logged in.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, db]);

  const handlePasswordReset = async () => {
    if (user && user.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        alert('Password reset email sent!');
      } catch (err) {
        console.error('Error sending password reset email:', err);
        alert('Failed to send password reset email.');
      }
    } else {
      alert('No email found for the current user.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="user-profile-container">
      <h1>Account Details</h1>
      {userData && (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Venmo:</strong> {userData.venmoUsername || 'Not provided'}</p>
        </div>
      )}
      <button onClick={handlePasswordReset}>Change Password</button>
    </div>
  );
}

export default UserProfile;