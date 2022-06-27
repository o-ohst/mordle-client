import { useContext, useEffect, useRef, useState } from "react";
import { ChannelContext } from "../../ChannelContext";
import MultplayerScoreItem from "../wordle/Multiplayer/MultiplayerScore";
import Timer from "../wordle/Timer";
import MessageDisplay from "./MessageDisplay";

function MultiplayerBar() {
    const { channel, players, setPlayers, playerId, setPlayerId, playerName, setPlayerName, round, setRound } = useContext(ChannelContext);
    //this is use to modularly build on top of the regular wordle functions.
    const [score, setScore] = useState(6);
    const [playerScores, setPlayerScores] = useState(players);
    const [roundEnd, setRoundEnd] = useState(false);
    const [gameEnd, setGameEnd] = useState(false);
    const [message, setMessage] = useState("");
    const [reset, setReset] = useState(false);
    const [finalScores, setFinalScores] = useState(players.map((p) => { return [p[0], p[1], 0]}));
    const [noCorrectPlayers, setCorrectPlayers] = useState(0);

    function setScores() {
        setPlayerScores(playerScores.map((p) => {
            return [p[0], p[1], "start"];
        }));
    }
    
    function decreasePlayer(currPlayerId, row) {
        setPlayerScores(playerScores.map((p) => {
            if (p[0] === currPlayerId) {
                return [p[0], p[1], row];
            }
            return p;
        }));
    }

    channel.on("new_guess", (msg) => {
        console.log(msg.playerName + " made a guess!")
        decreasePlayer(msg.playerId, msg.row);
    });

    function setFinish(currPlayerId, result) {
        if (result === "correct") {
            // setFinalScores(finalScores.map((p) => {
            //     if (p[0] === currPlayerId) {
            //         return [p[0], p[1], finalScores.length - noCorrectPlayers];
            //     }
            //     return p;
            // }));
            setCorrectPlayers(prev => {
                return prev + 1;
            });
        }
        const new_playerScores = playerScores.map((p) => {
            if (p[0] === currPlayerId) {
                if (result === "correct") {
                    return [p[0], p[1], result];
                } else {
                    return [p[0], p[1], "ran out"];
                }
            }
            return p;
        })
        setPlayerScores(new_playerScores);
    }

    channel.on("finish", (msg) => {
        setFinish(msg.playerId, msg.result)
    });

    function endRound(word) {
        setRoundEnd(true);
        setMessage("The word was: " + word + ", next round starting...");
    }

    function gameOverHandler(word) {
        setRoundEnd(true);
        setGameEnd(true);
        // let highest = finalScores[0][1];
        // for (let i = 0; i < finalScores.length - 1; i++) {
        //     if (finalScores[i + 1][2] > finalScores[i][2]) {
        //         highest = finalScores[i + 1][1];
        //     }
        // }
        const highest = finalScores.reduce((total, current) => {
            return current[2] > total[2] ? current : total
        })
        setMessage("The word was: " + word + ". The winner is: " + highest[1]);
    }

    channel.on("end_round", (msg) => {
        setFinalScores(finalScores.map(x => {
            const id = x[0]
            x[2] = msg.scores[id]
            return x
        }))
        if (msg.gameOver) {
            gameOverHandler(msg.word);
            return;
        }
        endRound(msg.word);
    });

    function resetRound() { 
        setRoundEnd(false);
        setGameEnd(false);
        setScores();
    }

    channel.on("start_round", (msg) => {
        console.log("round start!")
        resetRound();
        setRound(round + 1)
    });
    //make it in a horizontal bar
    return (
        <div>
            { (roundEnd ? ( gameEnd ? <MessageDisplay message={message} /> : <MessageDisplay message={message} /> ) : 
        <div className="multiplayerbar">
        <div>{round === 0 ? "" : "Round: " + round}</div>
        <div className="h4">{channel.topic}</div>
        <div className="multiplayerbar">
            {/* <MultplayerScoreItem playerName={playerName} score={score}/> */}
            {finalScores.map((p, i) => {
                return <MultplayerScoreItem key={i} playerName={p[1]} score={p[2]} state={playerScores.filter(x => p[0] === x[0])[0][2]} />
            })}
        </div>
        <div><Timer /></div>
        </div>
    )}
        </div>
    )
    //roomcode
    //insert timer
}

export default MultiplayerBar;