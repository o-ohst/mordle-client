import { Route, Routes } from "react-router-dom";

import MainMenuPage from "./pages/MainMenu";
import MultiplayerPage from "./pages/MultiplayerLanding";
import SingleplayerPage from "./pages/Singleplayer";
import SpeedRoundHostPage from "./pages/MultiplayerSpeedRound";
import WordlePage from "./pages/WordleSingleplayer";
import RoomPage from "./pages/RoomPage";
import { ChannelProvider } from "./ChannelContext";

//Routing between pages using react-router-dom

function App() {
  return (
    <ChannelProvider>
      <div>
        <Routes>
          <Route path="/" element={<MainMenuPage />} />
          <Route path="/singleplayer" element={<SingleplayerPage />} />
          <Route path="/singleplayer/wordle" element={<WordlePage />} />
          <Route path="/multiplayer" element={<MultiplayerPage />} />
          <Route path="/multiplayer/speedround/room" element={<RoomPage />} />
          <Route
            path="/multiplayer/speedround/game"
            element={<SpeedRoundHostPage />}
          />
        </Routes>
      </div>
    </ChannelProvider>
  );
}

export default App;
