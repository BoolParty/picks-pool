import React from 'react';
import './App.css';

const Home = ({
  games,
  loading,
  error,
  togglePick,
  formatSpread,
  user,
}) => {
    const removeLocation = (teamName) => {
        const words = teamName.split(' ');
        return words.length > 1 ? words.slice(1).join(' ') : teamName; // Remove the first word if there's more than one
      };
    const formatGameTitle = (awayTeam, homeTeam, 
        startTime) => {
        const formatTeam = (team) => team.slice(0, 3).toUpperCase(); // First 3 letters in uppercase
        const formattedTime = new Date(startTime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/New_York', // Adjust to ET
        });
        return `${formatTeam(awayTeam)} @ ${formatTeam(homeTeam)} | ${formattedTime}`;
    };

  return (
    <main className="content">
      {user ? (
        <>
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

              const gameTitle = formatGameTitle(
                game.away_team,
                game.home_team,
                game.commence_time // Assuming `commence_time` contains the start time in ISO format
              );

              return (
                <li key={game.id} className="game">
                  <div className="game-container">
                    <div className="game-title">
                      {gameTitle}
                    </div>
                    <div className="game-content">
                    <div className="team">
                        {removeLocation(game.away_team)}{' '}
                        <button onClick={() => togglePick(game.id, game.away_team, awaySpread.point)}>
                            {formatSpread(awaySpread.point)}
                        </button>
                        </div>
                        <div className="team">
                        {removeLocation(game.home_team)}{' '}
                        <button onClick={() => togglePick(game.id, game.home_team, homeSpread.point)}>
                            {formatSpread(homeSpread.point)}
                        </button>
                        </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p>Please sign in to view and make your picks!</p>
      )}
    </main>
  );
};

export default Home;