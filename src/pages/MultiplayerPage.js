import { Socket } from "phoenix-socket";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import MessageDisplay from "../components/wordlecomponents/MessageDisplay";
import Title from "../components/Title";
import { useContext, useState, useEffect } from "react";
import { MultiplayerContext } from "../contexts/MultiplayerContext";

function MultiplayerPage() {
  const {
    playerId,
    setPlayerId,
    playerName,
    setPlayerName,
    roomId,
    setSocket,
    setRoomId,  } =
    useContext(MultiplayerContext);
  const [roomCode1, setRoomCode1] = useState("");
  const [roomCode2, setRoomCode2] = useState("");
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomJoin, setRoomJoin] = useState(false);
  const [joinExisting, setJoinExisting] = useState(false);
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

  function handleCreate(event) {
    console.log("handleCreate");
    if (playerName === "" || playerName === undefined) return;
    event.preventDefault();
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

  function handleJoin(event) {
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

    if (event !== null) event.preventDefault();

    navigate("/room/" + roomId);
  }

  useEffect(() => {
    if (!roomCreated) return;
    handleJoin(null);
  }, [roomCreated]);

  // useEffect(() => {
  //   if (roomJoin) {
  //     console.log("successful room join");
  //     navigate("/multiplayer/game");
  //   }
  // }, [roomJoin]);

  return (
    <div className="flex flex-col h-full">
      <div className="h-1/4 flex-none flex justify-center">
        <Title></Title>
      </div>
      <div className="h-1/4 flex flex-col justify-center">
        <h1 className="mx-auto">Multiplayer</h1>
          <div className="flex flex-col items-center gap-6">
          <input
            className="input p-3 mt-8 text-2xl text-center select-none"
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
          onClick={handleCreate}
        >
          Create Room
        </button>
        <h2 className="mt-4 mb-4">OR</h2>
        <div className="rounded-2xl border-2 border-gray-200 p-4 flex flex-col items-center gap-4">
          <div>
            <input
              className="w-48 p-3 text-2xl text-center select-none font-mono"
              type="text"
              maxLength={11}
              onChange={handleRC1}
            ></input>
          </div>
          <button className="bg-torange" onClick={joinExistingHandler}>
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default MultiplayerPage;
