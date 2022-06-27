import { createContext, useState } from "react";

export const ChannelContext = createContext();

export function ChannelProvider({ children }) {
  const [channel, setChannel] = useState(null);
  const [players, setPlayers] = useState([]);
  const [playerId, setPlayerId] = useState();
  const [playerName, setPlayerName] = useState();
  const [round, setRound] = useState(0);

  const value = {
    channel,
    setChannel,
    players,
    setPlayers,
    playerId,
    setPlayerId,
    playerName,
    setPlayerName,
    round,
    setRound
  };

  return (
    <ChannelContext.Provider value={value}>{children}</ChannelContext.Provider>
  );
}
