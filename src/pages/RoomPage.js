import { useContext, useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChannelContext } from "../ChannelContext";
import PlayerReady from "../components/layout/PlayerReady";

function RoomPage(props) {
  const { channel, players, setPlayers, playerId, setPlayerId, playerName, setPlayerName } = useContext(ChannelContext);
  console.log(channel);
  //const [players, setPlayers] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [firstJoin, setFirstJoin] = useState(true);
  //const [playerId, setPlayerId] = useState(channel.playerId);
  //const [playerName, setPlayerName] = useState(channel.playerName);
  const [playerState, setPlayerState] = useState("joined");
  const [allReady, setAllReady] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const navigate = useNavigate();

  const stateRef = useRef();
  stateRef.current = players;

  channel.on("joined", (msg) => {
    if (firstJoin) {
      setPlayerId(msg.playerId);
      setPlayerName(msg.playerName);
      setFirstJoin(false);
    }
    setPlayers(
      msg.data.players.map((x) => [x.playerId, x.playerName, x.state])
    );
  });

  channel.on("ready", (msg) => {
    let newPlayers = stateRef.current;
    for (let i = 0; i < newPlayers.length; i++) {
      if (newPlayers[i][0] === msg.playerId) {
        newPlayers[i][2] = "ready";
        setPlayers(newPlayers);
        return;
      }
    }
  });

  function readyHandler() {
    if (!isReady) {
      setIsReady(true);
      setPlayerState("ready");
      channel.push("ready");
      return;
    }
    return;
  }

  useEffect(() => {
    for (let i = 0; i < players.length; i++) {
      if (players[i][2] !== "ready") {
        setAllReady(false);
        return;
      }
    }
    setAllReady(true);
  }, [players]);

  function start_game() {
    setGameStart(true);
    navigate("multiplayer/speedround/room");
  }

  channel.on("start_game", (msg) => {
    start_game();
  });

  return (
    <div>
      <h2>Mordle</h2>
      <h4>{channel.topic}</h4>
      <div className="readydisplay">
        <PlayerReady player={[playerId, playerName, playerState]} />
        {players.map((p, i) => {
          if (p[0] !== playerId) {
            return <PlayerReady key={i} player={p} />;
          }
          return <h4></h4>;
        })}
      </div>
      <PlayerReady players={players} />
      {isReady ? (
        allReady ? (
          gameStart ? (
            <h4>Game Start!</h4>
          ) : (
            <h4>Waiting for game to start...</h4>
          )
        ) : (
          <h4>Waiting for other players...</h4>
        )
      ) : (
        <button className="button7" onClick={readyHandler}>
          Ready
        </button>
      )}
    </div>
  );
}
// Room Page should have waiting room and ready button
// A place to see the other players in the room.
export default RoomPage;
