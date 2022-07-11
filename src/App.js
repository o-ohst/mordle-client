import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import MultiplayerLobbyPage from "./pages/MultiplayerLobbyPage";
import MultiplayerPage from "./pages/MultiplayerPage";
import SingleplayerPage from "./pages/SingleplayerPage";
import MultiplayerGamePage from "./pages/MultiplayerGamePage";

import { AppProvider } from "./contexts/AppContext";
import { MultiplayerProvider } from "./contexts/MultiplayerContext";
import { SingleWordleProvider } from "./contexts/SingleWordleContext";

function App() {
  return (
    <AppProvider>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <SingleWordleProvider>
            <Route path="/singleplayer" element={<SingleplayerPage />} />
          </SingleWordleProvider>
          <MultiplayerProvider>
            <Route path="/multiplayer" element={<MultiplayerPage />} />
            <Route path="/multiplayer/lobby" element={<MultiplayerLobbyPage />} />
            <Route path="/multiplayer/game" element={<MultiplayerGamePage />} />
          </MultiplayerProvider>
        </Routes>
      </div>
    </AppProvider>
  );
}

export default App;
