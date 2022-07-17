import MessageDisplay from "./MessageDisplay";

function Keyboard(props) {
  const letters = require("../data/keyboard.json").letters;

  function keyboardHandler(k) {
    props.handleKeyUp({key: k})
    return
  }

  return (
    <div className="keyboard">
      <MessageDisplay message={props.message} />
        {letters &&
          letters.map((row) => {
            return (
              <div className="keyrow">
                {row.map((l) => {
                  if (l === "ENTER") {
                    return (
                      <div
                        className="key"
                        onClick={() => keyboardHandler("Enter")}
                      >
                        {l}
                      </div>
                    );
                  }
                  if (l === "DEL") {
                    return (
                      <div
                        className="key"
                        onClick={() => keyboardHandler("Backspace")}
                      >
                        {l}
                      </div>
                    );
                  }
                  if (props.usedLetters[l.toLowerCase()]) {
                    const lower = l.toLowerCase();
                    return (
                      <div
                        className={"key " + props.usedLetters[lower]}
                        onClick={() => keyboardHandler(lower)}
                      >
                        {l}
                      </div>
                    );
                  }
                  return (
                    <div
                      className="key"
                      onClick={() => keyboardHandler(l.toLowerCase())}
                    >
                      {l}
                    </div>
                  );
                })}
              </div>
            );
          })}
    </div>
  );
}

export default Keyboard;