import { useContext } from "react";
import { ChannelContext } from "../ChannelContext";
import MultiplayerBar from "../components/layout/MultiplayerBar";
import Wordle from "../components/wordle/Wordle";

function SpeedRoundHostPage(props) {
  const { channel, players, setPlayers, playerId, setPlayerId, playerName, setPlayerName } = useContext(ChannelContext);

  return (
    <div>
      <div>
        <h2>Mordle</h2>
      </div>
      <div>
        <MultiplayerBar />
      </div>
      <div>
        <Wordle />
      </div>
    </div>
  );
}

export default SpeedRoundHostPage;
