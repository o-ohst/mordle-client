import logo from './logo.svg';
import './App.css';
import { Socket } from 'phoenix';
import { useEffect, useState, useReducer, useRef } from 'react';
import axios from 'axios';

function append(state, action) {
  if (action === "#reset") {
    return [];
  }
  return [...state, action];
}

function App() {

  const [socket, setSocket] = useState();
  const [channel, setChannel] = useState();
  const [roomId, setRoomId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [guess, setGuess] = useState("");
  const [name, setName] = useState("");
  const [messages, updateMessages] = useReducer(append, []);
  const [players, setPlayers] = useState([]);
  const [roomCreated, setRoomCreated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [roundStarted, setRoundStarted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [guessEnabled, setGuessEnabled] = useState(false);

  const stateRef = useRef();
  stateRef.current = players;

  useEffect(() => { //http request
    console.log("useEffect, []")
    axios
      .get(process.env.REACT_APP_API_URL + "/register")
      .then(res => {
        setPlayerId(res.data.playerId);
      });
  }, []);

  useEffect(() => { //connect to socket after setting playerId
    if (playerId === "" || playerId === undefined) return;
    console.log("useEffect, playerId")
    const socket = new Socket(process.env.REACT_APP_WS_URL, { params: { playerId: playerId } });
    socket.connect();
    setSocket(socket);
    console.log(socket);
  }, [playerId])

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleIdChange(event) {
    setRoomId(event.target.value);
  }

  function handleCreate(event) {
    console.log("handleCreate")
    if (name === "" || name === undefined) return;
    event.preventDefault();
    axios //http
      .get(process.env.REACT_APP_API_URL + "/create-room", { params: { playerId: playerId } })
      .then(res => {
        console.log(res.data)
        setRoomId(res.data.roomId);
        setRoomCreated(true);
      });
  }

  useEffect(() => { //join room after creating room
    if (!roomCreated) return;
    handleJoin(null);
  }, [roomCreated])

  useEffect(() => { //send ready after ready
    if (!isReady) return;
    channel.push("ready")
  }, [isReady])

  function handleJoin(event) {
    console.log("handleJoin: " + roomId)

    if (name === "" || name === undefined) {
      return;
    }

    if (event !== null) event.preventDefault();

    const channel = socket.channel("room:" + roomId, { "playerName": name });

    channel.on("joined", msg => {
      updateMessages(msg.playerName + " joined.")
      setPlayers(msg.data.players.map(x => [x.playerId, x.playerName]));
    });
    channel.on("new_guess", msg =>
      updateMessages(msg.playerName + " made a guess, row: " + msg.row)
    );
    channel.on("ready", msg => updateMessages(msg.playerName + " is ready.")
    );
    channel.on("start_game", msg => setGameStarted(true));
    channel.on("start_round", msg => {
      updateMessages("#reset");
      updateMessages("New round started.");
      setRoundStarted(true);
      setGameStarted(true);
      setGuessEnabled(true);
    }
    );
    channel.on("end_round", msg => {
      if (msg.gameOver) {
        setGameOver(true);
        setTimeout(() => {
          setRoomId("");
          setGuess("");
          setName("");
          setPlayers([]);
          setRoomCreated(false);
          setIsReady(false);
          setRoundStarted(false);
          setGameStarted(false);
          updateMessages("#reset");
          setChannel(null);
          setGameOver(false);
        }, 10000)
      }
      updateMessages("Round ended. The word was " + msg.word);
      for (let key in msg.scores) {
        stateRef.current.filter(x => x[0] === key).forEach(s =>
          updateMessages(s[1] + " score: " + msg.scores[key]));
      }
      setRoundStarted(false);
      setGuessEnabled(false);
    }
    )
    channel.on("presence_diff", msg => {
      // Object.entries(msg.joins).forEach(([id, data]) => {
      //   updateMessages(id + " joined again.");
      // });
      Object.entries(msg.leaves).forEach(([id, data]) => {
        updateMessages(id + " left.");
      });
    })

    channel.join()
      .receive('ok', () => {
        console.log('joined successfully')
        setChannel(channel);
        channel.push("joined")
      })
      .receive('error', () => {
        console.log("error")
      })

    return () => {
      channel.leave();
    }
  }

  function handleGuessChange(event) {
    setGuess(event.target.value);
  }

  function handleGuess(event) {
    event.preventDefault();
    channel.push("new_guess", { "guess": guess })
      .receive('ok', (reply) => {
        console.log("guess result " + reply.result)
        updateMessages("Guess evaluated: " + reply.result)
        if (reply.row === 6) {
          updateMessages("You ran out of guesses :(")
          setGuessEnabled(false);
        }
      });
    event.target.reset();
  }


  return (
    playerId === "" || (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" style={{ "width": "320px", "marginBottom": "-20px" }} />
        {channel == null ?
          (<div>
            <h2 style={{ "marginTop": "0px" }}>
              Mordle Demo 1.0 (Alpha)
            </h2>
            <br />
            <form>
              <label htmlFor="id" style={{ "fontSize": "20px" }}>Name</label><br />
              <input type="text" id="name" name="name" onChange={handleNameChange} style={{ "fontSize": "20px" }} /><br /><br />
              <div style={{ "display": "flex", "justifyContent": "center" }} >
                <div>
                  <label htmlFor="id" style={{ "fontSize": "20px" }}>Room ID</label><br />
                  <input type="text" id="id" name="id" onChange={handleIdChange} style={{ "width": "70%", "fontSize": "20px" }} /><br />
                  <input type="submit" onClick={handleJoin} value="Join" style={{ "fontSize": "20px" }} />
                </div>
                <h3>OR</h3>
                <div>
                  <br />
                  <input type="submit" onClick={handleCreate} value="Create" style={{ "fontSize": "20px", "marginLeft": "30px" }} />
                </div>
              </div>
            </form>
          </div>
          ) :
          (<div>
            <h2 style={{ "margin": "0px" }}>ROOM {roomId}</h2>
            <h3>Players: {players.length}</h3>
            <h3>{players.map(x => <sp style={{ "border": "solid 1px", "marginRight": "8px", "paddingLeft": "2px", "paddingRight": "2px" }}>{x[1]}</sp>)}</h3>
            <textarea readOnly value={messages.join("\n")} style={{ "overflowY": "scroll", "width": "500px", "height": "300px", "resize": "none", "fontSize": "18px" }}>
            </textarea>
            <br /><br />
            {isReady || (<button onClick={() => setIsReady(true)} style={{ "fontSize": "20px" }}>Ready</button>)}
            {isReady && (
              gameStarted ? (
                roundStarted ? (
                  guessEnabled ? (
                  <form onSubmit={handleGuess}>
                    <label htmlFor="guess" style={{ "fontSize": "20px" }}>Make a guess:</label><br />
                    <input type="text" id="fname" name="fname" onChange={handleGuessChange} style={{ "fontSize": "20px" }} /><br /><br /><br />
                    <input type="submit" value="Submit" style={{ "fontSize": "20px" }} />
                    </form>) :
                    (<h3>No more guesses :(</h3>)
                  ) : (
                    gameOver ? <h3>Game ended.</h3> : <h3>Round starting soon...</h3>
                )
              ) : (<h3>Waiting for others to get READY...</h3>)
            )}
          </div>
          )
        }

      </div>)
  );
}

export default App;
