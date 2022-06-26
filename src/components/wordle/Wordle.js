import { Channel } from "phoenix-socket";
import { useState, useEffect } from "react";
import Grid from "../layout/Grid";
import Keyboard from "../layout/Keyboard";

function Wordle(props) {
  //To make wordle, a state hook with an array of arrays is required
  //first is letter and second is colour state.

  const [guessArray, setGuessArray] = useState([...Array(6)]);
  //Guess history that is displayed after every turn.
  const [guessHist, setHistory] = useState([]);
  //State that tracks the current turn number.
  const [turn, setTurn] = useState(0);
  //State that keeps current guess (to possible send up to the server)
  const [currentGuess, setCurrGuess] = useState("");
  //Receive whether correct that means 22222 will be received
  const [isCorrect, setCorrect] = useState(false);
  //Used Keys and their colour
  const [usedLetters, setUsedLetters] = useState({});
  
  const [message, setMessage] = useState("");

  const [receivedColors, setReceivedColors] = useState("22222");

  //Multiplayer States
  const [channel, setChannel] = useState();

  const allowed_words = require("./allowed_words.json").allowed_words;
  //const { currentGuess, handleKeyUp, guessArray, isCorrect, turn, usedLetters, message } = WordleOps(props.solution);
  function guessFormat() {
    //channel.on{"new_guess",}
    const splitReceivedColors = [...receivedColors];
    return [...currentGuess].map((letter, index) => {
        let color = "grey";
        if (splitReceivedColors[index] === "2") {
          color = "green";
        } else if (splitReceivedColors[index] === "1") {
          color = "yellow";
        }
        return { key: letter, color }

    // LOCAL IMPLEMENTATION
    // return [...currentGuess].map((letter, index) => {
    //   let color = "grey";
    //   if (solutionLetters[index] === letter) {
    //     color = "green";
    //   } else if (solutionLetters.includes(letter)) {
    //     color = "yellow";
    //   }
    //   return { key: letter, color };
    });
  }
  //add one to turn, add new guess if correct update state and send to server
  function addGuess(formattedGuess) {
    setGuessArray((prevGuesses) => {
      let newGuesses = [...prevGuesses];
      newGuesses[turn] = formattedGuess;
      return newGuesses;
    });
    setHistory((prevHistory) => {
      return [...prevHistory, currentGuess];
    });
    setTurn((prevTurn) => {
      return prevTurn + 1;
    });
    setUsedLetters((prev) => {
      let newKeys = { ...prev };

      formattedGuess.forEach((letter) => {
        const currColor = newKeys[letter.key];

        if (letter.color === "green") {
          newKeys[letter.key] = "green";
          return;
        }
        if (letter.color === "yellow" && currColor !== "green") {
          newKeys[letter.key] = "yellow";
          return;
        }

        if (
          letter.color === "grey" &&
          currColor !== "green" &&
          currColor !== "yellow"
        ) {
          newKeys[letter.key] = "grey";
          return;
        }
      });
      return newKeys;
    });
    if (receivedColors === "22222") {
      setCorrect(true)
      setMessage("You've won!")
    }
    setCurrGuess("");
  }

  //if user presses enter check if guess is a real word
  function handleKeyUp({ key }) {
    if (isCorrect) {
      return
    }
    if (key === "Enter") {
      // add guess if enough turns, not in history, length = 5, valid word
      if (turn > 5) {
        setMessage("You ran out of guesses!");
        return;
      }
      if (currentGuess.length !== 5) {
        setMessage("Too short!");
        return;
      }
      if (guessHist.includes(currentGuess)) {
        setMessage("Why try the same word?");
        return;
      }
      //not sure why its not working
      if (!allowed_words.includes(currentGuess)) {
        setMessage("This word does not exist!");
        return;
      }
      const formatted = guessFormat();
      addGuess(formatted);
    }
    if (key === "Backspace") {
      setCurrGuess((prev) => {
        return prev.slice(0, -1);
      });
      return;
    }
    if (/^[A-Za-z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrGuess((prev) => {
          return prev + key;
        });
      }
    }
  }

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp)

    return () => window.removeEventListener('keyup', handleKeyUp)
  }, [handleKeyUp])

  useEffect(() => {
    console.log(guessArray, turn, isCorrect)
  }, [guessArray, turn, isCorrect]
  )

  return (
    <div>
      <Grid currentGuess={currentGuess} guesses={guessArray} turn={turn} />
      <Keyboard usedLetters={usedLetters} message={message} handleKeyUp={handleKeyUp} />
    </div>
  );
}

export default Wordle;
