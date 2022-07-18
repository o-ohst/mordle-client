import { MultiplayerContext } from "../contexts/MultiplayerContext";
import { useNavigate } from "react-router-dom";
import PlayerReady from "../components/PlayerReady";
import Wordle from "../components/wordlecomponents/Wordle";
import { useState, useContext, useEffect, useRef } from "react";
import ReadyButton from "../components/ReadyButton";
import { WordleContext } from "../contexts/WordleContext";
import MultiplayerBar from "../components/wordlecomponents/MultiplayerBar";
import Title from "../components/Title"
import {useTimer} from "use-timer"

function MultiplayerGamePage() {
  const {
    channel,
    validSession,
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
    setMessage
  } = useContext(WordleContext);
  const [isReady, setReady] = useState(false);
  const [allReady, setAllReady] = useState(false);
  const [multiBarMessage, setMultiBarMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [mouseEnter, setMouseEnter] = useState(false);
  const navigate = useNavigate();

  const stateRef = useRef();
  stateRef.current = players;  
  const stateRef2 = useRef();
  stateRef2.current = finalScores;

  const { time, start, pause, reset } = useTimer({
    initialTime: 180,
    endTime: 0,
    timerType: "DECREMENTAL",
  });

  function backHome() {
    navigate("/");
    return;
  }

  function resetRound() {
    setTimeout(() => {
      setCurrentGuess("");
      setGuesses([...Array(6)]);
      setHistory([[],[]]);
      setRow(0);
      setRound(0);
      setUsedLetters({});
      setDisableGrid(true);
    }, 2000);
  }

  function readyHandler() {
    setReady(true);
    channel.push("ready");
    return;
  }

  function colorFunction(guess, func) {
    channel.push("new_guess", { guess: guess }).receive("ok", (reply) => {
        console.log("Received colors: " + reply.result);
        func(reply.result);
    });
  }

  function onReady(playerId) {
    setPlayers((prev) => {
        const new_players = prev.map((player) => {
          if (player[0] === playerId) {
            player[2] = "ready";
          }
          return player;
        });
        return new_players;
      });
  }

  function start_game() {
    const new_finals = stateRef.current.map((p) => {
        return [p[0], p[1], 0];
      });
    setFinalScores(new_finals);
    setAllReady(true);
    start();
  }

  function endRound(word) {
    setMultiBarMessage("The word was: " + word + ", next round starting...");
    setRoundEnd(true);
    resetRound();
  }

  function setScores() {
    setPlayers((prev) => {
      const new_reset = prev.map((p) => {
        return [p[0], p[1], "start"];
      });
      return new_reset;
    });
  }

  function startRound() {
    if(!gameStart) {
        setGameStart(true);
    }
    setRound((prev) => {return prev + 1;});
    setScores();
    setRoundEnd(false);
    setGameEnd(false);
    setMessage("");
    setMultiBarMessage("");
    setDisableGrid(false);
    return;
  }

  function gameOverHandler(word) {
    setRoundEnd(true);
    setGameEnd(true);
    const highest = stateRef2.current.reduce((total, current) => {
      return current[2] > total[2] ? current : total;
    });
    setMultiBarMessage(
      "The word was: " + word + highest[1] +" wins!"
    );
  }

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

  function setFinish(currPlayerId, result) {
    const new_playerScores = stateRef.current.map((p) => {
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

  useEffect(() => {

    const ch = channel;
    
    ch.on("ready", (msg) => {
      console.log("ready received");
        onReady(msg.playerId);
    });

    ch.on("start_game", (msg) => {
        console.log("Game Start!")
      start_game();
    });

    ch.on("start_round", (msg) => {
      console.log("Start round!");
      startRound();
    });

    ch.on("end_round", (msg) => {
      console.log("End Round!");
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
        setMessage("Round ended! The word was: " + msg.word + ".");
        endRound(msg.word);
        return;
      }
    });

    ch.on("new_guess", (msg) => {
      console.log(msg.playerName + " made a guess!");
      decreasePlayer(msg.playerId, msg.row);
    });

    ch.on("finish", (msg) => {
        console.log(msg.playerId + msg.result + " finished.")
      setFinish(msg.playerId, msg.result);
    });

    setTimeout(() => {
      setMouseEnter(true)
    }, 2000)

  }, []);

  return (
    <div className="flex flex-col h-full items-center">
      <div className="flex-none flex justify-center items-center pt-3 md:pt-8">
        <div className="flex">
          <img className="my-auto w-8 h-8 md:w-16 md:h-16 animate-spin hover:animate-bounce" src="/M.png" alt="logo"></img>
          <img className="my-auto w-16 h-8 md:w-32 md:h-16 " src="/ordle.png" alt="logo"></img>
        </div>
      </div>
      <div className="flex-none flex justify-center">
        {validSession ? (
          gameStart ? (
            <div className="w-screen flex-none">
              <MultiplayerBar time={time} />
              <Wordle colorFunction={colorFunction} message={multiBarMessage} />
            </div>
          ) : (
              <div className="flex flex-col items-center mt-5 gap-4">
                <div className="flex flex-col items-center">
                  <h2 className="text-white text-2xl font-sans mb-2">{copied ? "Copied!" : mouseEnter ? "Click to copy!" : "Room Code"}</h2>
                  <div className="bg-white text-tblue rounded-2xl w-fit h-fit select-text text-center p-5  transition ease-in-out hover:-translate-y-1 active:translate-y-1"
                    onClick={() => {
                      navigator.clipboard.writeText(roomId)
                      setCopied(true);
                      setTimeout(() => {setCopied(false)}, 3000)
                    }}
                    onMouseEnter={() => {
                      setMouseEnter(true);
                    }}
                    onMouseLeave={() => {
                      setMouseEnter(false);
                    }}
                    >
                    <h1 className="text-tblue font-mono text-xl md:text-2xl">{roomId}</h1>
                  </div>
                </div>
                <div className="">
                  <PlayerReady players={players} />
                </div>
                <div className="absolute bottom-16">
                  <ReadyButton
                    className="mt-12 bg-tpurple"
                    isReady={isReady}
                    allReady={allReady}
                    readyHandler={readyHandler}
                  />
                </div>
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
    </div>
    //if no roomId show return to start button
    //if game not started show ready player states
    //else show
  );
}

export default MultiplayerGamePage;
