import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPicks, setSelectedPicks] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const formatSpread = (spread) => {
    return spread > 0 ? `+${spread}` : spread.toString();
  };

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        const response = await axios.get(
          'https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/',
          {
            params: {
              apiKey: process.env.REACT_APP_ODDS_API_KEY, // Using environment variable
              regions: 'us',
              markets: 'spreads',
              oddsFormat: 'american',
            },
          }
        );
        setGames(response.data); // Save the fetched games in state
      } catch (err) {
        setError('Failed to fetch odds. Please try again.');
      } finally {
        setLoading(false); // Mark loading as complete
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
        setDrawerOpen(true); // Open the drawer on first pick
        return [...prevPicks, { gameId, team, spread, wager: '' }];
      }
    });
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

  const allWagersSelected = selectedPicks.every((pick) => pick.wager);

  return (
    <div className="app">
      <header className="title-section">
        <h1>NFL Pick Party</h1>
        <button className="account-button">Account</button>
        <hr />
      </header>

      <main className="content">
        <h2 className="section-header">NFL</h2>
        <hr className="sub-header-line" />

        {loading && <p>Loading games...</p>}
        {error && <p>{error}</p>}

        <ul className="games-list">
  {games.map((game) => {
    const spreads = game.bookmakers[0]?.markets[0]?.outcomes || [];
    const awaySpread = spreads.find((outcome) => outcome.name === game.away_team);
    const homeSpread = spreads.find((outcome) => outcome.name === game.home_team);

    if (!awaySpread || !homeSpread) return null;

    return (
      <li key={game.id} className="game">
        <div className="team">
          {game.away_team} <button onClick={() => togglePick(game.id, game.away_team, awaySpread.point)}>
            {formatSpread(awaySpread.point)}
          </button>
        </div>
        <div className="team">
          {game.home_team} <button onClick={() => togglePick(game.id, game.home_team, homeSpread.point)}>
            {formatSpread(homeSpread.point)}
          </button>
        </div>
      </li>
    );
  })}
</ul>
      </main>

      {drawerOpen && (
  <div className="drawer">
    {/* Drawer title */}
    <div className="drawer-title">
      <h2>Pick Sheet</h2>
    </div>

    {/* Drawer header */}
    <div className="drawer-header">
      <span>Team</span>
      <span>Spread</span>
      <span style={{ textAlign: 'right' }}>Wager Amount</span>
    </div>

    {/* Drawer rows */}
    {selectedPicks.map((pick, index) => (
      <div
        key={`${pick.gameId}-${pick.team}`}
        className="drawer-row"
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f7f7f7')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
      >
        <button className="remove-pick" onClick={() => removePick(index)}>x</button>
        <span>{pick.team}</span>
        <span>{formatSpread(pick.spread)}</span>
        <select value={pick.wager} onChange={(e) => updateWager(index, e.target.value)}>
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

    {/* Drawer footer */}
    <div className="drawer-footer">
      <button
        className={`place-picks-button ${allWagersSelected ? 'active' : ''}`}
        disabled={!allWagersSelected}
        onClick={() => alert('Picks placed!')}
      >
        Place Picks
      </button>
      <span className="total-wager">
        Total: ${selectedPicks.reduce((sum, pick) => sum + Number(pick.wager || 0), 0)}
      </span>
    </div>
  </div>
)}
    </div>
  );
}

export default App;