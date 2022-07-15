import { useTimer } from "use-timer";

function ReadyButton(props) {
//   const { time, start } = useTimer({
//     initialTime: 4,
//     timerType: "DECREMENTAL",
//   });

  if (props.allReady) {
    return <h4>Game starts in:</h4>;
  }
  if (props.isReady) {
    return <h4>Waiting for other players...</h4>;
  } else {
    return (
      <button className="button7" onClick={props.readyHandler}>
        Ready
      </button>
    );
  }
}

export default ReadyButton;
