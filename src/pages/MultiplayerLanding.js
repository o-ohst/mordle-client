import { useState, useEffect, useReducer, useContext } from "react";
import { Socket } from "phoenix-socket";
import axios from "axios";

import { Link, Navigate, useNavigate } from "react-router-dom";
import classes from "./MenuPages.module.css";
import MessageDisplay from "../components/layout/MessageDisplay";
import { ChannelContext } from "../ChannelContext";

function MultiplayerPage() {
  const [roomCode1, setRoomCode1] = useState("");
  const [roomCode2, setRoomCode2] = useState("");
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("or");
  const [socket, setSocket] = useState();
  const {channel, setChannel} = useContext(ChannelContext);
  const [playerId, setPlayerId] = useState("");
  const [roomCreated, setRoomCreated] = useState(false);
  const [toRoom, setToRoom] = useState(false);
  const navigate = useNavigate();
  const [roomJoinOnly, setRoomJoin] = useState(false);
  const [joinExisting, setJoinExisting] = useState(false);

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
    setName(event.target.value);
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
    if (name === "" || name === undefined) return;
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

  useEffect(() => {
    if (!roomCreated) return;
    handleJoin(null);
    console.log("successful creation");
  }, [roomCreated]);

  function joinExistingHandler(event) {
    setJoinExisting(true);
    handleJoin(event);
    return
  }


  function handleJoin(event) {
    console.log("handleJoin: " + roomId + " Name: " + name);
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
    if (name === "" || name === undefined) {
      setMessage("Please use a name");
      return;
    }

    if (event !== null) event.preventDefault();

    const channel = socket.channel("room:" + roomId, { playerName: name });

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
    if (roomJoinOnly) {
      console.log("successful room join");
      navigate("/multiplayer/speedround/room");
    }
  }, [roomJoinOnly]);

  return (
    <div>
      <h1>Mordle</h1>
      <h3>Multiplayer</h3>
      <h2>Speed Rounds</h2>

      <form className="menu">
        <label>Name:</label>
        <input
          className={classes.input}
          type="text"
          placeholder="John"
          onChange={handleNameChange}
          required
        ></input>
        <button
          className={classes.button6}
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
            className={classes.inputsplit}
            type="text"
            placeholder="hello"
            maxLength={5}
            onChange={handleRC1}
          ></input>
          <p className={classes.inbetween}>-</p>
          <input
            className={classes.inputsplit}
            type="text"
            placeholder="world"
            value={roomCode2}
            onChange={handleRC2}
          ></input>
        </div>
        <Link
          className={classes.Link}
          to={{
            pathname: "/multiplayer/speedround/room",
            state: {
              channel: channel,
            },
          }}
        >
          <button className={classes.button7} onClick={joinExistingHandler}>
            Join Existing Room
          </button>
        </Link>
      </form>
    </div>
  );
}
//should change to onClick=findRoom after
export default MultiplayerPage;
