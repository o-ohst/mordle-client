import { useContext, useEffect, useRef, useState } from "react";
import { ChannelContext } from "../../ChannelContext";
import MultplayerScoreItem from "../wordle/Multiplayer/MultiplayerScore";
import Timer from "../wordle/Timer";
import MessageDisplay from "./MessageDisplay";

function MultiplayerBar() {
    const { channel, players, setPlayers, playerId, setPlayerId, playerName, setPlayerName } = useContext(ChannelContext);
    //this is use to modularly build on top of the regular wordle functions.
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(6);
    const [playerScores, setPlayerScores] = useState(players)
    const [roundEnd, setRoundEnd] = useState(false);
    const [gameEnd, setGameEnd] = useState(false);
    const [message, setMessage] = useState("");
    const [reset, setReset] = useState(false);

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
        const new_playerScores = players.map((p) => {
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

    function gameOverHandler(word, winner) {
        setRoundEnd(true);
        setGameEnd(true);
        setMessage("The word was: " + word + ".The winner is: " + winner);
    }

    channel.on("end_round", (msg) => {
        if (msg.gameOver) {
            gameOverHandler(msg.word, "No one");
        }
        endRound(msg.word);
    });

    function resetRound() { 
        setRoundEnd(false);
        setGameEnd(false);
        setScores();
        setRound(prev => {
            return prev + 1;
        });
    }

    channel.on("start_round", (msg) => {
        console.log("round start!")
        resetRound();
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
            {playerScores.map((p, i) => {
                return <MultplayerScoreItem key={i} playerName={p[1]} score={p[2]} />
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