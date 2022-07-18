import { Socket } from "phoenix-socket";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import MessageDisplay from "../components/wordlecomponents/MessageDisplay";
import Title from "../components/Title";
import { useContext, useState, useEffect } from "react";
import { MultiplayerContext } from "../contexts/MultiplayerContext";

function MultiplayerPage() {
  const {
    channel,
    setChannel,
    playerId,
    setPlayerId,
    setPlayers,
    playerName,
    setPlayerName,
    roomId,
    socket,
    setSocket,
    setRoomId,
  } = useContext(MultiplayerContext);
  const [roomCode1, setRoomCode1] = useState("");
  const [roomCode2, setRoomCode2] = useState("");
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomJoin, setRoomJoin] = useState(false);
  const [joinExisting, setJoinExisting] = useState(false);
  const [createClicked, setCreateClicked] = useState(false);
  const [joinClicked, setJoinClicked] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect, []");
    axios.get(process.env.REACT_APP_API_URL + "/register").then((res) => {
      setPlayerId(res.data.playerId);
    });
  }, []);

  useEffect(() => {
    //connect to socket after setting playerId
    if (playerId === "" || playerId === undefined) return;
    console.log("useEffect, playerId");
    const socket = new Socket(process.env.REACT_APP_WS_URL, {
      params: { playerId: playerId },
    });
    socket.connect();
    setSocket(socket);
    console.log(socket);
  }, [playerId]);

  function handleNameChange(event) {
    setPlayerName(event.target.value);
  }

  function handleRC1(event) {
    setRoomCode1(event.target.value);
  }

  useEffect(() => {
    setRoomId(roomCode1);
  }, [roomCode1]);

  function handleCreate() {
    console.log("handleCreate");
    if (playerName === "" || playerName === undefined) return;
    axios //http
      .get(process.env.REACT_APP_API_URL + "/create-room", {
        params: { playerId: playerId },
      })
      .then((res) => {
        console.log(res.data);
        setRoomId(res.data.roomId);
        setRoomCreated(true);
      });
  }

  function joinExistingHandler(event) {
    setJoinExisting(true);
    handleJoin(event);
    return;
  }

  function handleJoin() {
    console.log("handleJoin: " + roomId + " Name: " + playerName);
    if (joinExisting) {
      if (roomCode1.length < 5) {
        setMessage("First roomcode is too short.");
        return;
      }
    }
    if (playerName === "" || playerName === undefined) {
      setMessage("Please use a name");
      return;
    }
    const channel = socket.channel("room:" + roomId, {
      playerName: playerName,
    });

    channel.on("joined", (msg) => {
        console.log("joined received on multiplayer page");
        onJoin(
          msg.data.players.map((x) => [x.playerId, x.playerName, x.state])
        );
      });

    channel
      .join()
      .receive("ok", () => {
        console.log("joined successfully");
        setChannel(channel);
      })
      .receive("error", () => {
        console.log("error");
        setMessage("No such room exists!");
        return;
      });
    return () => {
      channel.leave();
    };
  }

  function onJoin(array) {
    setPlayers(array);
    if (!roomJoin) {
      setRoomJoin(true);
      navigate("/room/" + roomId);
    }
  }

  useEffect(() => {
    if (channel !== null) {
    }
  }, [channel]);

  useEffect(() => {
    if (!roomCreated) return;
    handleJoin(null);
  }, [roomCreated]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center">
        <Title></Title>
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="mx-auto text-2xl mt-6">Multiplayer</h1>
        <div className="flex flex-col items-center gap-6">
          <input
            className="input p-3 mt-6 text-center"
            type="text"
            placeholder="Name"
            onChange={handleNameChange}
            required
            ></input>
        </div>
      </div>
      <div className="h-2/4 flex flex-col items-center mt-4">
        <button
          className="bg-tpurple"
          onClick={() => { setCreateClicked(true); }} onTransitionEnd={() => { if (createClicked) handleCreate(); }}
        >
          Create Room
        </button>
        <h2 className="mt-4 mb-4">OR</h2>
        <div className="rounded-2xl border-2 border-gray-200 p-4 flex flex-col items-center gap-4">
          <div>
            <input
              className="w-48 p-3 text-center font-mono"
              type="text"
              maxLength={11}
              onChange={handleRC1}
            ></input>
          </div>
          <button className="bg-torange" onClick={() => { setJoinClicked(true); }} onTransitionEnd={() => { if (joinClicked) joinExistingHandler(); } }>
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default MultiplayerPage;
