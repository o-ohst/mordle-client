import { useContext, useState, useRef, useEffect } from 'react';
import Grid from './components/Grid';
import { SingleplayerContext } from './SingleplayerContext';
import axios from "axios"

function Singleplayer() {

    const { guesses, setGuesses } = useContext(SingleplayerContext); //[[guess, score]..x6]

    const stateRef = useRef();
    stateRef.current = guesses;

    useEffect(() => {
        // setGuesses([["abcde", "12021"], ["bdfur", "20100"]]);
        console.log(guesses)
    }, []);

    function handleGuess(e) {
        e.preventDefault();
        if (guesses.length >= 6) return;
        const thisGuess = e.target.guess.value;
        axios.post(process.env.REACT_APP_API_URL + "/guess", { guess: thisGuess })
            .then(res => {
                setGuesses(oldGuesses => [...oldGuesses, [thisGuess, res.data.score]])
            });
    }

    return (
        <div>
            <Grid guesses={guesses}></Grid>
            <form onSubmit={handleGuess}>
                <label htmlFor="guess" style={{ "fontSize": "20px" }}>Make a guess:</label><br />
                <input type="text" id="guess" name="guess" style={{ "fontSize": "20px" }} /><br /><br /><br />
                <input type="submit" value="Submit" style={{ "fontSize": "20px" }} />
            </form>
        </div>
    )
}

export default Singleplayer;