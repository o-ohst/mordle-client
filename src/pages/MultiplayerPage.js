import { Socket } from "phoenix-socket";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import MessageDisplay from "../components/wordlecomponents/MessageDisplay";
import { useContext, useState, useEffect } from "react";
import { MultiplayerContext } from "../contexts/MultiplayerContext";

function MultiplayerPage() {
  const { setChannel, playerId, setPlayerId, playerName, setPlayerName, roomId, setRoomId } =
    useContext(MultiplayerContext);
  const [roomCode1, setRoomCode1] = useState("");
  const [roomCode2, setRoomCode2] = useState("");
  const [socket, setSocket] = useState();
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomJoin, setRoomJoin] = useState(false);
  const [joinExisting, setJoinExisting] = useState(false);
  const [message, setMessage] = useState("or existing room ID:");
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

  function handleRC2(event) {
    setRoomCode2(event.target.value);
  }

  useEffect(() => {
    setRoomId(roomCode1 + "-" + roomCode2);
  }, [roomCode1, roomCode2]);

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
      if (roomCode2.length < 5) {
        setMessage("Second roomcode is too short.");
        return;
      }
    }
    if (playerName === "" || playerName === undefined) {
      setMessage("Please use a name");
      return;
    }

    if (event !== null) event.preventDefault();

    const channel = socket.channel("room:" + roomId, {
      playerName: playerName,
    });

    channel
      .join()
      .receive("ok", () => {
        console.log("joined successfully");
        setChannel(channel);
        channel.push("joined");
        setRoomJoin(true);
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

  useEffect(() => {
    if (!roomCreated) return;
    handleJoin(null);
    console.log("successful creation");
  }, [roomCreated]);

  useEffect(() => {
    if (roomJoin) {
      console.log("successful room join");
      navigate("/multiplayer/game");
    }
  }, [roomJoin]);

  return (
    <div>
      <h1>Mordle</h1>
      <h3>Multiplayer</h3>
      <h2>Speed Rounds</h2>

      <form className="menu">
        <input
          className="input"
          type="text"
          placeholder="Name"
          onChange={handleNameChange}
          required
        ></input>
        <br />
        <button
          className="button6"
          onClick={(e) => {
            handleCreate(e);
          }}
        >
          Create New Room
        </button>
        <div className="message">
          <MessageDisplay message={message} />
        </div>
        <div>
          <input
            className="inputsplit"
            type="text"
            placeholder=""
            maxLength={5}
            onChange={handleRC1}
          ></input>
          <p className="inbetween">-</p>
          <input
            className="inputsplit"
            type="text"
            placeholder=""
            maxLength={5}
            onChange={handleRC2}
          ></input>
        </div>
        <button className="button7" onClick={joinExistingHandler}>
          Join Room
        </button>
      </form>
    </div>
  );
}

export default MultiplayerPage;
