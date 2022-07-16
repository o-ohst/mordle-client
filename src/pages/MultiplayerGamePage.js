import { MultiplayerContext } from "../contexts/MultiplayerContext";
import { useNavigate } from "react-router-dom";
import PlayerReady from "../components/PlayerReady";
import Wordle from "../components/wordlecomponents/Wordle";
import { useState, useContext, useRef, useEffect } from "react";
import ReadyButton from "../components/ReadyButton";
import { WordleContext } from "../contexts/WordleContext";
import MultiplayerBar from "../components/wordlecomponents/MultiplayerBar";

function MultiplayerGamePage() {
  const {
    channel,
    gameStart,
    setGameStart,
    roomId,
    players,
    setPlayers,
    setRound,
    setRoundEnd,
    setGameEnd,
    finalScores,
    setFinalScores,
  } = useContext(MultiplayerContext);
  const {
    setGuesses,
    setHistory,
    setRow,
    setCurrentGuess,
    setDisableGrid,
    setUsedLetters,
    setMessage,
    setReceivedColors,
  } = useContext(WordleContext);
  const [isReady, setReady] = useState(false);
  const [allReady, setAllReady] = useState(false);
  const [multiBarMessage, setMultiBarMessage] = useState("");
  const navigate = useNavigate();

  const stateRef = useRef();
  stateRef.current = setReceivedColors;

  function backHome() {
    navigate("/");
    return;
  }

  channel.on("joined", (msg) => {
    setPlayers(
      msg.data.players.map((x) => [x.playerId, x.playerName, x.state])
    );
  });

  channel.on("ready", (msg) => {
    setPlayers((prev) => {
      const new_players = prev.map((player) => {
        if (player[0] === msg.playerId) {
          player[2] = "ready";
        }
        return player;
      });
      return new_players;
    });
  });

  function readyHandler() {
    setReady(true);
    channel.push("ready");
    return;
  }

  function start_game() {
    setAllReady(true);
    setFinalScores(
      players.map((p) => {
        return [p[0], p[1], 0];
      })
    );
  }

  channel.on("start_game", (msg) => {
    start_game();
  });

  function colorFunction(guess) {
    channel.push("new_guess", { guess: guess }).receive("ok", (reply) => {
      console.log("Received colors: " + reply.result);
      setReceivedColors(reply.result);
    });
  }

  function endRound(word) {
    setRoundEnd(true);
    reset();
    setMultiBarMessage("The word was: " + word + ", next round starting...");
  }

  function gameOverHandler(word) {
    setRoundEnd(true);
    setGameEnd(true);
    const highest = finalScores.reduce((total, current) => {
      return current[2] > total[2] ? current : total;
    });
    setMultiBarMessage(
      "The word was: " + word + ". The winner is: " + highest[1]
    );
    setMessage("Thanks for playing!")
  }

  channel.on("end_round", (msg) => {
    setFinalScores((prev) => {
      const new_finalscores = prev.map((x) => {
        const id = x[0];
        x[2] = msg.scores[id];
        return x;
      });
      return new_finalscores;
    });
    if (msg.gameOver) {
      gameOverHandler(msg.word);
      return;
    } else {
      setMessage("Round ended! New round starting...");
    }
    endRound(msg.word);
  });

  function reset() {
    setTimeout(() => {
        setCurrentGuess("");
        setGuesses([...Array(6)]);
        setHistory([]);
        setRow(0);
        setRound(0);
        setUsedLetters({});
        setDisableGrid(true);
      }, 2000);
  }

  function setScores() {
    setPlayers((prev) => {
      const new_reset = prev.map((p) => {
        return [p[0], p[1], "start"];
      });
      return new_reset;
    });
  }

  channel.on("start_round", (msg) => {
    if (allReady) {
      setGameStart(true);
      setAllReady(false);
    }
    console.log("Start round!");
    setRound((prev) => prev + 1);
    setScores();
    setRoundEnd(false);
    setGameEnd(false);
    setMessage("");
    setMultiBarMessage("");
    setDisableGrid(false);
  });

  function decreasePlayer(currPlayerId, row) {
    setPlayers((prev) => {
      const new_scores = prev.map((p) => {
        if (p[0] === currPlayerId) {
          return [p[0], p[1], row];
        }
        return p;
      });
      return new_scores;
    });
  }

  channel.on("new_guess", (msg) => {
    console.log(msg.playerName + " made a guess!");
    decreasePlayer(msg.playerId, msg.row);
  });

  function setFinish(currPlayerId, result) {
    const new_playerScores = players.map((p) => {
      if (p[0] === currPlayerId) {
        if (result === "correct") {
          return [p[0], p[1], result];
        } else {
          return [p[0], p[1], "ran out"];
        }
      }
      return p;
    });
    setPlayers(new_playerScores);
  }

  channel.on("finish", (msg) => {
    setFinish(msg.playerId, msg.result);
  });

  return (
    <div>
      <h2>Mordle</h2>
      {roomId ? (
        gameStart ? (
          <div>
            <MultiplayerBar message={multiBarMessage} />
            <Wordle colorFunction={colorFunction} />
          </div>
        ) : (
          <div>
            <h4>Waiting Room</h4>
            <h4>Room ID: "{roomId}"</h4>
            <PlayerReady players={players} />
            <ReadyButton
              isReady={isReady}
              allReady={allReady}
              readyHandler={readyHandler}
            />
          </div>
        )
      ) : (
        <div>
          <h2>No session found</h2>
          <button className="button6" onClick={backHome}>
            Return to homepage
          </button>
        </div>
      )}
    </div>
    //if no roomId show return to start button
    //if game not started show ready player states
    //else show
  );
}

export default MultiplayerGamePage;
