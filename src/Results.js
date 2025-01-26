// Results.js
import React, { useEffect, useState } from 'react';

const Results = ({ userId }) => {
  const [results, setResults] = useState({ won: [], lost: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true); // Reset loading on dependency change
      try {
        const response = await fetch(`${apiUrl}/api/results/${userId}`);
        const data = await response.json();
        setResults(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching results:', error.message);
        setError('Failed to load results.');
        setLoading(false);
      }
    };
  
    fetchResults();
  }, [apiUrl, userId]);

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
            <div className="column-counterparty">vs.</div>
            <div className="column-amount">$</div>
            <div className="column-settled">Paid?</div>
          </div>
          {results?.won?.length > 0 ? (
            results.won.map((pick) => (
              <div key={pick.id} className="results-box-row">
                <div className="column-pick">{pick.gameTitle}</div>
                <div className="column-counterparty">{pick.matchedUserEmail || 'N/A'}</div>
                <div className="column-amount">${pick.amount || 0}</div>
                <div className="column-settled">{pick.settled ? 'Yes' : 'No'}</div>
              </div>
            ))
          ) : (
            <div className="results-box-row">
              <p>No winning picks yet.</p>
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
            <div className="column-counterparty">vs.</div>
            <div className="column-amount">$</div>
            <div className="column-settled">Paid?</div>
          </div>
          {results?.lost?.length > 0 ? (
            results.lost.map((pick) => (
              <div key={pick.id} className="results-box-row">
                <div className="column-pick">{pick.gameTitle}</div>
                <div className="column-counterparty">{pick.matchedUserEmail || 'N/A'}</div>
                <div className="column-amount">${pick.amount || 0}</div>
                <div className="column-settled">{pick.settled ? 'Yes' : 'No'}</div>
              </div>
            ))
          ) : (
            <div className="results-box-row">
              <p>No losing picks yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
