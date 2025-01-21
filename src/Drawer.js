import React from 'react';
import './App.css';

const Drawer = ({
  drawerOpen,
  drawerCollapsed,
  handleDrawerToggle,
  selectedPicks,
  setSelectedPicks,
  updateWager,
  allWagersSelected,
  user,
}) => {
  if (!drawerOpen) return null;

  // Define apiUrl here using environment variable
  const apiUrl = process.env.REACT_APP_API_URL;

  // Define removePick function here
  const removePick = (indexToRemove) => {
    setSelectedPicks((prevPicks) => prevPicks.filter((_, index) => index !== indexToRemove));
  };

  // Function to place all selected picks
const handlePlaceAllPicks = async () => {
    try {
      // Enrich all selected picks with additional metadata
      const enrichedPicks = selectedPicks.map((pick) => ({
        ...pick,
        user: user ? user.email : 'Guest', // Add user email
        timestamp: new Date(), // Add timestamp
        wager: Number(pick.wager), // Ensure wager is a number
        gameId: pick.gameId,
      }));
  
      console.log('Submitting picks:', enrichedPicks); // Debug log
  
      // Send all enriched picks to the backend in a single request
      const response = await fetch(`${apiUrl}/api/picks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrichedPicks),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Picks successfully submitted:', data);
        alert('Picks submitted successfully!');
        setSelectedPicks([]); // Clear picks after successful submission
      } else {
        const error = await response.json();
        console.error('Failed to submit picks:', error);
        alert('Failed to submit picks. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting picks:', err);
      alert('An error occurred while submitting picks.');
    }
  };

  return (
    <div className={`drawer ${drawerCollapsed ? 'collapsed' : ''}`}>
      <button className="drawer-toggle" onClick={handleDrawerToggle}>
        {drawerCollapsed ? '<<' : '>>'}
      </button>
      <div className="drawer-title">
        <h2>Pick Sheet</h2>
      </div>
      <div className="drawer-header">
        <span>Team</span>
        <span>Spread</span>
        <span style={{ textAlign: 'right' }}>Wager Amount</span>
      </div>
      {selectedPicks.map((pick, index) => (
        <div
          key={`${pick.gameId}-${pick.team}`}
          className="drawer-row"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f7f7f7')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
        >
          <button className="remove-pick" onClick={() => removePick(index)}>
            x
          </button>
          <span>{pick.team}</span>
          <span>{pick.spread}</span>
          <select
            value={pick.wager}
            onChange={(e) => updateWager(index, e.target.value)}
          >
            <option value="">Select</option>
            <option value="25">$25</option>
            <option value="50">$50</option>
            <option value="75">$75</option>
            <option value="100">$100</option>
            <option value="150">$150</option>
            <option value="200">$200</option>
            <option value="250">$250</option>
          </select>
        </div>
      ))}
      <div className="drawer-footer">
        <button
          className={`place-picks-button ${allWagersSelected ? 'active' : ''}`}
          disabled={!allWagersSelected}
          onClick={handlePlaceAllPicks} // Updated to use handlePlaceAllPicks
        >
          Place Picks
        </button>
        <span className="total-wager">
          Total: $
          {selectedPicks.reduce((sum, pick) => sum + Number(pick.wager || 0), 0)}
        </span>
      </div>
    </div>
  );
};

export default Drawer;