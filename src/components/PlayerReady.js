function PlayerReady(props) {

  return (
    <div className="readydisplay">
      {props.players.map((player) => {
        return (
        <div key={player[0]} className={player[2]}>
          <img src="/person-svgrepo-com.svg" alt="Person Logo"></img>
          <div className="h2">{player[1] + " : " + player[2]}</div>
        </div> )
      })}
    </div>
  );
}

export default PlayerReady;
