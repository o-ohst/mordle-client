import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Wordle from "../components/wordlecomponents/Wordle";
import Title from "../components/Title";
import WordleModal from "../components/wordlecomponents/WordleModal";
import { AppContext } from "../contexts/AppContext";
import { WordleContext } from "../contexts/WordleContext";
import { useTimer } from "use-timer";

function SingleplayerPage() {
  const { loggedIn, playedToday, setPlayedToday } = useContext(AppContext);
  const {
    setGuesses,
    history,
    setHistory,
    setRow,
    setCurrentGuess,
    setDisableGrid,
    setUsedLetters,
    setMessage,
    receivedColors,
    setReceivedColors,
  } = useContext(WordleContext);

  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [timerActive, setTimerActive] = useState(false);

  const { time, start, pause, reset } = useTimer({
    initialTime: 0,
    timerType: "INCREMENTAL",
  });

  useEffect(() => {
    if (!timerActive) {
        setDisableGrid(true);
        start();
        setTimerActive(true);
    }
  }, [timerActive])

  useEffect(() => {
    if (time === 0) {
        setDisableGrid(false);
    }
  }, [time]);

  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (loggedIn && !playedToday) {
      axios.get(url + "/played-today").then((res) => {
        setPlayedToday(res.played);
      });
    }
  }, [loggedIn, playedToday, setPlayedToday, url]);

  useEffect(() => {
    if (playedToday) {
      setDisableGrid(true);
      setModalMsg("You have played once today, come back tommorrow!");
      setShowModal(true);
    }
  }, [playedToday]);

  function formatTime(seconds) {
    return (seconds / 60 < 1 ? "0" : Math.floor(seconds/60)) + (seconds % 60 < 10 ? ":0" : ":") + (seconds%60);
  }

  function colorFunction(currGuess, func) {
    axios
      .post(url + "/guess", {
        guess: currGuess,
      })
      .then((res) => {
        console.log("Received colors: " + res.data.score);
        func(res.data.score);
      });
    return;
  }

  useEffect(() => {
    if (receivedColors === "22222") {
      if (!playedToday) {
        pause();
        setDisableGrid(true);
        axios
          .post(url + "/end-game", {
            scores: history[1],
            timeTaken: time,
          })
          .then((res) => {
            setModalMsg("The word was: " + res.data.word);
            setShowModal(true);
          });
        setPlayedToday(true);
        return;
      }
    }

    if (history[0].length === 6) {
      if (!playedToday) {
        pause();
        setDisableGrid(true);
        axios
          .post(url + "/end-game", {
            scores: history[1],
            timeTaken: time,
          })
          .then((res) => {
            setModalMsg(
              "The word was: " + res.word + ". Better luck next time!"
            );
            setShowModal(true);
          });
        setPlayedToday(true);
        return;
      }
    }
  }, [history]);

  return (
    <div className="h-screen">
      <div className="flex-none flex justify-center items-center pt-3 md:pt-8">
        <div className="flex">
          <img className="my-auto w-8 h-8 md:w-16 md:h-16 animate-spin hover:animate-bounce" src="/M.png" alt="logo"></img>
          <img className="my-auto w-16 h-8 md:w-32 md:h-16 " src="/ordle.png" alt="logo"></img>
        </div>
      </div>
      <div className="my-1 md:my-3">
        <h3 className="text-center text-tpink md:text-2xl">{formatTime(time)}</h3>
      </div>
      <Wordle colorFunction={colorFunction} />
      {showModal && <WordleModal message={modalMsg} />}
    </div>
  );
}

export default SingleplayerPage;
