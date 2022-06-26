import MultplayerScoreItem from "../wordle/Multiplayer/MultiplayerScore";
import Timer from "../wordle/Timer";

function MultiplayerBar() {

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