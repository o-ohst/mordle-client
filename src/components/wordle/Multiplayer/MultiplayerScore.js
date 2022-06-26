
function MultplayerScoreItem(props) {
  //take in the score of the other players
  return (
    <div>
        <div>{props.playerName}</div>
      <img src="/person-svgrepo-com.svg"alt="Person Logo"></img>
      <div>{props.score}</div>
    </div>
  );
}

export default MultplayerScoreItem