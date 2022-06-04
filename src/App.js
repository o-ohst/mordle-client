import logo from './logo.svg';
import './App.css';
import { Socket } from 'phoenix';
import { useEffect, useState, useReducer } from 'react';

function append(state, action) {
  return [...state, action];
}

function playerReducer(state, action) {
  switch (action) {
    case "+":
      return state + 1;
    case "-":
      return state - 1;
    default:
      return
  }
}

function App() {

  const [socket, setSocket] = useState();
  const [channel, setChannel] = useState();
  const [id, setId] = useState();
  const [guess, setGuess] = useState("");
  const [name, setName] = useState("");
  const [messages, updateMessages] = useReducer(append, []);
  const [players, updatePlayers] = useReducer(playerReducer, 0);

  useEffect(() => {
    console.log(process.env)
    const socket = new Socket(process.env.REACT_APP_WS_URL, { room_id: id });
    socket.connect();
    setSocket(socket);
    console.log(socket);
  }, []);

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleIdChange(event) {
    setId(event.target.value);
  }

  function handleJoin(event) {
    console.log("handleJoin")

    if (id == null || name == null) {
      return;
    }

    event.preventDefault();
    const channel = socket.channel("room:" + id);

    channel.on("joined", msg => {
      updateMessages(msg.name + " joined.")
      updatePlayers("+");
    });
    channel.on("new_guess", msg => updateMessages(msg.name + " made a guess: " + msg.guess));

    channel.join()
      .receive('ok', () => {
        console.log('joined successfully')
        setChannel(channel);    
        channel.push("joined", {"name": name})
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
    channel.push("new_guess", { "name": name, "guess": guess });
    event.target.reset();
  }


  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" style={{"width": "320px", "marginBottom" : "0px"}}/>
      { channel == null ?
        (<div>
          <h2 style={{"marginTop" : "0px"}}>
          Mordle Demo 0.00 (Alpha)
          </h2>
          <br/>
          <form onSubmit={handleJoin}>
            <label htmlFor="id" style={{ "fontSize": "20px" }}>Name</label><br />
            <input type="text" id="name" name="name" onChange={handleNameChange} style={{ "fontSize": "20px" }} /><br /><br />
          <label htmlFor="id" style={{ "fontSize": "20px" }}>Room ID</label><br />
          <input type="text" id="id" name="id" onChange={handleIdChange} style={{ "fontSize": "20px" }} /><br /><br /><br />
          <input type="submit" value="Join" style={{ "fontSize": "20px" }} />
          </form>
          </div>
          ) :
        (<div>
          <h2 style={{ "margin": "0px" }}>Room {id}</h2>
          <textarea readOnly value={messages.join("\n")} style={{ "overflowY": "scroll", "width": "500px", "height": "300px", "resize": "none", "fontSize": "18px" }}>
          </textarea>
          <br /><br />
          <form onSubmit={handleGuess}>
          <label htmlFor="guess" style={{ "fontSize": "20px" }}>Make a guess:</label><br/>
          <input type="text" id="fname" name="fname" onChange={handleGuessChange} style={{ "fontSize": "20px" }} /><br /><br /><br />
          <input type="submit" value="Submit" style={{ "fontSize": "20px" }} />
          </form>
        </div>
        )
      }
      
    </div>
  );
}

export default App;
