function MultplayerScoreItem(props) {
    //take in the score of the other players
    return (
      <div>
          <div>{props.playerName}</div>
        <h3 style={{ "marginTop": "0px", "marginBottom": "0px", "color" : "magenta" }}>{props.score}</h3>
        <div>{props.state}</div>
      </div>
    );
  }
  
  export default MultplayerScoreItem