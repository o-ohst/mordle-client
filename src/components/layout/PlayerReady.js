function PlayerReady(props) {
  if (props.player) {
    return (
      <div key={props.player[2]} className={props.player[2]}>
        <img src="/person-svgrepo-com.svg" alt="Person Logo"></img>
        <div className="h2">{props.player[1] + " : " + props.player[2]}</div>
      </div>
    );
  }

  return (
    <div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default PlayerReady;
