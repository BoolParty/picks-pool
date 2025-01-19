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

              return (
                <li key={game.id} className="game">
                  <div className="game-container">
                    <div className="team">
                      {game.away_team}{' '}
                      <button onClick={() => togglePick(game.id, game.away_team, awaySpread.point)}>
                        {formatSpread(awaySpread.point)}
                      </button>
                    </div>
                    <div className="team">
                      {game.home_team}{' '}
                      <button onClick={() => togglePick(game.id, game.home_team, homeSpread.point)}>
                        {formatSpread(homeSpread.point)}
                      </button>
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