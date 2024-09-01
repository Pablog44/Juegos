import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { signInAnonymously, signOut, onAuthStateChanged } from 'firebase/auth';
import SnakeGame from './games/SnakeGame';
import MinesweeperGame from './games/MinesweeperGame';

function App() {
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = () => {
    signInAnonymously(auth).catch((error) => {
      console.error("Error signing in anonymously:", error);
    });
  };

  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      console.error("Error signing out:", error);
    });
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to the Game Center</h1>
          {user ? (
            <>
              <p>Logged in as {user.isAnonymous ? "Anonymous" : user.email}</p>
              <button onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <button onClick={handleSignIn}>Play as Guest</button>
          )}
          <nav>
            <ul>
              <li><Link to="/snake">Snake Game</Link></li>
              <li><Link to="/minesweeper">Minesweeper Game</Link></li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/snake" element={<SnakeGame />} />
          <Route path="/minesweeper" element={<MinesweeperGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
