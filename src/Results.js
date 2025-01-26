// Results.js
import React, { useEffect, useState } from 'react';

const Results = ({ user }) => {
  const [results, setResults] = useState({ won: [], lost: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true); // Reset loading on dependency change
      try {
        const response = await fetch(`${apiUrl}/api/results/${user.email}`);
        const data = await response.json();
        setResults({
          won: data.filter((result) => result.outcome === 'WON'),
          lost: data.filter((result) => result.outcome === 'LOST'),
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching results:', error.message);
        setError('Failed to load results.');
        setLoading(false);
      }
    };
  
    fetchResults();
  }, [apiUrl, user]);

  if (loading) return <p>Loading results...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="results-container">
      <h1>Results</h1>
  
      {/* WON Section */}
      <div className="results-section">
        <h2>WON</h2>
        <div className="results-box">
          <div className="results-box-header">
            <div className="column-pick">Pick</div>
            <div className="column-amount">$</div>
            <div className="column-opponent">vs.</div>
            <div className="column-outcome">Outcome</div>
          </div>
          {results?.won?.length > 0 ? (
            results.won.map((result) => (
              <div key={result._id} className="results-box-row">
                <div className="column-pick">{result.team} {result.spread}</div>
                <div className="column-amount">${result.matchedWager || 0}</div>
                <div className="column-opponent">{result.matchedUserEmail || 'N/A'}</div>
                <div className="column-outcome">{result.outcome}</div>
              </div>
            ))
          ) : (
            <div className="results-box-row">
              <p>No winning results yet.</p>
            </div>
          )}
        </div>
      </div>
  
      {/* LOST Section */}
      <div className="results-section">
        <h2>LOST</h2>
        <div className="results-box">
          <div className="results-box-header">
            <div className="column-pick">Pick</div>
            <div className="column-amount">$</div>
            <div className="column-opponent">vs.</div>
            <div className="column-outcome">Outcome</div>
          </div>
          {results?.lost?.length > 0 ? (
            results.lost.map((result) => (
              <div key={result._id} className="results-box-row">
                <div className="column-pick">{result.team} {result.spread}</div>
                <div className="column-amount">${result.matchedWager || 0}</div>
                <div className="column-opponent">{result.matchedUserEmail || 'N/A'}</div>
                <div className="column-outcome">{result.outcome}</div>
              </div>
            ))
          ) : (
            <div className="results-box-row">
              <p>No losing results yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
