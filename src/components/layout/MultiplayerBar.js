import { useContext } from "react";
import { ChannelContext } from "../../ChannelContext";
import MultplayerScoreItem from "../wordle/Multiplayer/MultiplayerScore";
import Timer from "../wordle/Timer";

function MultiplayerBar() {
    const { channel, players, setPlayers, playerId, setPlayerId, playerName, setPlayerName } = useContext(ChannelContext);
    //this is use to modularly build on top of the regular wordle functions.
    return (
        <div>
        <div></div>
        <div>
            <MultplayerScoreItem playerNum="P1" score="4" />
        </div>
        <div><Timer /></div>
        </div>
    )
    //roomcode
    //insert timer
}

export default MultiplayerBar;