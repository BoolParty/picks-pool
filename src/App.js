import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from "react-router-dom";
import Account from "./Account";
import Home from './Home';
import Drawer from './Drawer';
import Login from './Login';
import UserProfile from "./UserProfile";
import MatchedPicks from "./MatchedPicks";
import UnmatchedPicks from "./UnmatchedPicks";

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPicks, setSelectedPicks] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCollapsed, setDrawerCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // React Router navigation

  const formatSpread = (spread) => {
    return spread > 0 ? `+${spread}` : spread.toString();
  };

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // User is logged in, update state
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Guest', // Fallback for display name
        });
      } else {
        // User is logged out, reset state
        setUser(null);
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_ODDS_API_KEY;
    const fetchOdds = async () => {
      try {
        const response = await axios.get(
          'https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/',
          {
            params: {
              apiKey: apiKey,
              regions: 'us',
              markets: 'spreads',
              oddsFormat: 'american',
            },
          }
        );

        // Filter games with a valid start time
        const now = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(now.getDate() + 7);

      const filteredGames = response.data.filter((game) => {
        const gameStartTime = new Date(game.commence_time); // Convert commence_time to Date
        return gameStartTime >= now && gameStartTime <= sevenDaysFromNow;
      });

        setGames(filteredGames);
      } catch (err) {
        setError('Failed to fetch odds. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, []);

  const togglePick = (gameId, team, spread) => {
    setSelectedPicks((prevPicks) => {
      const exists = prevPicks.find((pick) => pick.gameId === gameId && pick.team === team);
      if (exists) {
        return prevPicks.filter((pick) => !(pick.gameId === gameId && pick.team === team));
      } else {
        setDrawerOpen(true);
        return [...prevPicks, { gameId, team, spread, wager: '' }];
      }
    });
  };

  const handleDrawerToggle = () => {
    setDrawerCollapsed((prev) => !prev);
  };

  const updateWager = (index, amount) => {
    setSelectedPicks((prevPicks) => {
      const updatedPicks = [...prevPicks];
      updatedPicks[index].wager = amount;
      return updatedPicks;
    });
  };

  const removePick = (index) => {
    setSelectedPicks((prevPicks) => prevPicks.filter((_, i) => i !== index));
  };

  return (
      <div className="app">
        <header className="title-section">
          <h1>
            <a href="/" className="site-title">
              NFL Pick Party
            </a>
          </h1>
          {user ? (
            <button className="account-button" onClick={() => navigate("/account")}>
              Account
            </button>
          ) : (
            <button className="account-button" onClick={() => navigate("/login")}>
              Sign In
            </button>
          )}
        </header>

        <Routes>
          <Route path="/" element={<Home
                games={games}
                loading={loading}
                error={error}
                togglePick={togglePick}
                formatSpread={formatSpread}
                user={user}
              />
            }
          />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/matchedpicks" element={<MatchedPicks user={user} />} />
          <Route path="/unmatchedpicks" element={<UnmatchedPicks user={user} />} />
        </Routes>

        <Drawer
          drawerOpen={drawerOpen}
          drawerCollapsed={drawerCollapsed}
          handleDrawerToggle={handleDrawerToggle}
          selectedPicks={selectedPicks}
          removePick={removePick}
          updateWager={updateWager}
          allWagersSelected={selectedPicks.every((pick) => pick.wager)}
          setSelectedPicks={setSelectedPicks}
          user={user}
        />
      </div>
  );
}

export default App;