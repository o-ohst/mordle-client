import { useEffect, useState } from "react";
import Keyboard from "../components/layout/Keyboard";
import Wordle from "../components/wordle/Wordle";

function WordlePage() {
  // not sure how to solve using solution picker and passing on as prop

  const [solution, setSolution] = useState("blame");

//   useEffect(() => {
//     // Create local db on a json server first whilst waiting for backend.
//     fetch("http://localhost:3001/solutions")
//       // async wait for list of possible words.
//       .then((res) => res.json())
//       .then((json) => {
//         const randomSolution = json[Math.floor(Math.random() * json.length)];
//         setSolution(randomSolution.word);
//       });
//   }, [setSolution]);

  return (
    <div>
      <p>
        <h1>Mordle</h1>
      </p>
      <p>
        <h3>Wordle</h3>
      </p>
      <Wordle solution={solution} />
    </div>
  );
}

export default WordlePage;
