import React, { useEffect, useState } from 'react';
import './App.css';

const UnmatchedPicks = ({ user }) => {
  const [unmatchedPicks, setUnmatchedPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnmatchedPicks = async () => {
      const url = `http://localhost:5001/api/picks/unmatched/${user.email}`;
      console.log('Fetching unmatched picks from:', url); // Debug log
  
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched unmatched picks:', data); // Debug log
          setUnmatchedPicks(data);
        } else {
          const error = await response.json();
          console.error('Fetch error response:', error); // Debug log
          setError('Failed to fetch unmatched picks.');
        }
      } catch (err) {
        console.error('Error fetching unmatched picks:', err); // Debug log
        setError('An error occurred while fetching unmatched picks.');
      } finally {
        setLoading(false); // Set loading to false after fetch is done
      }
    };
  
    // Safeguard: Ensure user.email exists before fetching
    if (user?.email) {
      fetchUnmatchedPicks();
    } else {
      console.error('User email is undefined, skipping fetch'); // Debug log
      setError('User email is required to fetch unmatched picks.');
    }
  }, [user]);

  if (loading) return <p>Loading unmatched picks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="unmatched-picks-container">
      <h1>Unmatched Picks</h1>
      {unmatchedPicks.length === 0 ? (
        <p>No unmatched picks found</p>
      ) : (
        <ul className="unmatched-pick-list">
          {unmatchedPicks.map((pick) => (
            <li key={pick._id} className="unmatched-pick-item">
              <strong>Team:</strong> {pick.team} | <strong>Spread:</strong> {pick.spread > 0 ? `+${pick.spread}` : pick.spread} | <strong>Wager:</strong> ${pick.wager}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UnmatchedPicks;