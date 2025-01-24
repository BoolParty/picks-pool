// Results.js
import React, { useEffect, useState } from 'react';

const Results = ({ userId }) => {
  const [results, setResults] = useState({ won: [], lost: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`${apiUrl}/results/${userId}`);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching results:', error.message);
      }
    };
  
    fetchResults();
  }, [userId]);

  if (loading) return <p>Loading results...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="results-container">
      <h1>Results</h1>

      <div className="results-section">
        <h2>WON</h2>
        {results.won.length > 0 ? (
          <ul>
            {results.won.map((pick) => (
              <li key={pick.id}>
                <span>{pick.gameTitle}</span> - <strong>{pick.pick}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>No winning picks yet.</p>
        )}
      </div>

      <div className="results-section">
        <h2>LOST</h2>
        {results.lost.length > 0 ? (
          <ul>
            {results.lost.map((pick) => (
              <li key={pick.id}>
                <span>{pick.gameTitle}</span> - <strong>{pick.pick}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>No losing picks yet.</p>
        )}
      </div>
    </div>
  );
};

export default Results;
