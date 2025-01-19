import React, { useEffect, useState } from 'react';
import './App.css';

const MatchedPicks = ({ user }) => {
  const [matchedPicks, setMatchedPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchedPicks = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/picks/matched/${user.email}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched matched picks:', data); // Add this log to see the response data
          setMatchedPicks(data);
        } else {
          setError('Failed to fetch matched picks');
        }
      } catch (err) {
        setError('An error occurred while fetching matched picks');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.email) {
      fetchMatchedPicks();
    }
  }, [user]);

  if (loading) return <p>Loading matched picks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="matched-picks-container">
      <h1>Matched Picks</h1>
      {matchedPicks.length === 0 ? (
        <p>No Matched picks found</p>
      ) : (
        <ul className="matched-pick-list">
          {matchedPicks.map((pick) => (
            <li key={pick._id} className="matched-pick-item">
              <strong>Team:</strong> {pick.team} | <strong>Spread:</strong> {pick.spread > 0 ? `+${pick.spread}` : pick.spread}
              <br />
              <p></p>
              <strong className="matched-with">Confirmed Bet:</strong>
              {pick.matchedUserEmail && pick.matchedUserEmail.length > 0 && pick.matchedWager && pick.matchedWager.length > 0 ? (
                pick.matchedUserEmail.map((userEmail, index) => {
                  if (pick.matchedUserEmail.length === 1 && pick.matchedWager.length === 1 && index === 0) {
                    return (
                      <div key={index}>
                        <p>Amount: ${pick.matchedWager[0]}</p> {/* Only display the first matched wager */}
                        <p>Counterparty: {pick.matchedUserEmail[0]}</p> {/* Display the first matched user */}
                      </div>
                    );
                  } else if (pick.matchedUserEmail.length === 2 && pick.matchedWager.length === 1 && index === 0) {
                    return (
                      <div key={index}>
                        <p>Amount: ${pick.matchedWager[0]}</p> {/* Always display the first matched wager */}
                        <p>Counterparty: {pick.matchedUserEmail[1]}</p> {/* Display the second matched user */}
                      </div>
                    );
                  } else if (pick.matchedUserEmail.length === 2 && pick.matchedWager.length === 2 && index === 1) {
                    return (
                      <div key={index}>
                        <p>Amount: ${pick.matchedWager[1]}</p> {/* Display the second matched wager */}
                        <p>Counterparty: {pick.matchedUserEmail[1]}</p> {/* Display the second matched user */}
                      </div>
                    );
                  }
                })
              ) : null}
          </li>
        ))}
      </ul>
    )}
    </div>
  );
};

export default MatchedPicks;