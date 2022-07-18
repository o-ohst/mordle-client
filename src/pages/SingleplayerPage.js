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

  const { time, start, stop, reset } = useTimer({
    initialTime: 0,
    timerType: "INCREMENTAL",
  });

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

  function colorFunction(guess) {
    axios
      .post(url + "/guess", {
        guess: guess,
      })
      .then((res) => {
        console.log("Received colors: " + res.score);
        setReceivedColors(res.score);
      });
    return;
  }

  useEffect(() => {
    if (receivedColors === "22222") {
      if (loggedIn && !playedToday) {
        axios.post(url + "/end-game", {
          scores: history[1],
          timeTaken: 1,
        });
      }
    }
  });

  return (
    <div className="h-full">
      <div className="h-[10%] md:h-[20%] flex-none flex justify-center items-center pt-4">
        <div className="flex">
          <img className="my-auto w-10 h-10 md:w-20 md:h-20 animate-spin hover:animate-bounce" src="/M.png" alt="logo"></img>
          <img className="my-auto w-20 h-10 md:w-40 md:h-20 " src="/ordle.png" alt="logo"></img>
        </div>
      </div>
      <Wordle colorFunction={colorFunction} />
      {showModal && <WordleModal message={modalMsg} />}
    </div>
  );
}

export default SingleplayerPage;
