import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and signup
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        // Create a new user account in Firebase
        await createUserWithEmailAndPassword(auth, email, password);
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