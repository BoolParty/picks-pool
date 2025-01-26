import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import './App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [venmoUsername, setVenmoUsername] = useState(''); // New state for Venmo username
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and signup
  const navigate = useNavigate();
  const db = getFirestore(); // Firestore instance

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        // Create a new user account in Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // Save additional user data to Firestore
        await setDoc(doc(db, 'users', userId), {
          email: email,
          venmoUsername: venmoUsername,
        });

        alert('Account created successfully!');
      } else {
        // Sign in an existing user
        await signInWithEmailAndPassword(auth, email, password);
        alert('Logged in successfully!');
      }
      navigate('/'); // Redirect to the Picks page
    } catch (error) {
      // Handle errors from Firebase
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <h1>{isSignUp ? 'Create Account' : 'Sign In'}</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {isSignUp && (
        <input
          type="text"
          placeholder="Venmo Username"
          value={venmoUsername}
          onChange={(e) => setVenmoUsername(e.target.value)}
        />
      )}
      <button onClick={handleAuth}>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </button>
      <p onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp
          ? 'Already have an account? Sign In'
          : "Don't have an account? Create one"}
      </p>
    </div>
  );
}

export default Login;