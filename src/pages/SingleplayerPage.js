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
    initialTime: -5,
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
    <div className="h-full">
      <div className="h-28 flex-none flex justify-center">
        <div className="flex mt-4">
          <img className="my-auto w-12 h-12 hover:animate-bounce" src="/M.png" alt="logo"></img>
          <img className="my-auto w-24 h-12" src="/ordle.png" alt="logo"></img>
        </div>
      </div>
      <h2>{"Time elapsed: " + time + " seconds"}</h2>
      <Wordle colorFunction={colorFunction} />
      {showModal && <WordleModal message={modalMsg} />}
    </div>
  );
}

export default SingleplayerPage;
