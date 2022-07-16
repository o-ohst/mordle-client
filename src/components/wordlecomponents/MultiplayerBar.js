import { useContext } from "react";
import { MultiplayerContext } from "../../contexts/MultiplayerContext";
import MessageDisplay from "./MessageDisplay";
import MultplayerScoreItem from "./MultiplayerScoreItem";

function MultiplayerBar(props) {
  const { channel, players, roundEnd, gameEnd, round, finalScores } =
    useContext(MultiplayerContext);
  return (
    <div>
      {roundEnd ? (
        gameEnd ? (
          <MessageDisplay message={props.message} />
        ) : (
          <MessageDisplay message={props.message} />
        )
      ) : (
        <div className="multiplayerbar">
          <div>{round === 0 ? "" : "Round: " + round}</div>
          <div className="h4">{channel.topic}</div>
          <div className="multiplayerbar">
            {finalScores.map((p, i) => {
              return (
                <MultplayerScoreItem
                  key={i}
                  playerName={p[1]}
                  score={p[2]}
                  state={players.filter((x) => p[0] === x[0])[0][2]}
                />
              );
            })}
          </div>
          <div></div>
        </div>
      )}
    </div>
  );
}

export default MultiplayerBar;
