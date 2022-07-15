import MessageDisplay from "./MessageDisplay";

function Keyboard(props) {
  const letters = require("../data/keyboard.json").letters;

  function keyboardHandler(k) {
    props.handleKeyUp({key: k})
    return
  }

  return (
    <div>
      <MessageDisplay message={props.message} />
      <div className="keypad">
        {letters &&
          letters.map((row) => {
            return (
              <div className="row">
                {row.map((l) => {
                  if (l === "ENTER") {
                    return (
                      <div
                        className="button"
                        onClick={() => keyboardHandler("Enter")}
                      >
                        {l}
                      </div>
                    );
                  }
                  if (l === "DELETE") {
                    return (
                      <div
                        className="button"
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
                        className={props.usedLetters[lower]}
                        onClick={() => keyboardHandler(lower)}
                      >
                        {l}
                      </div>
                    );
                  }
                  return (
                    <div
                      className="letter"
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
    </div>
  );
}

export default Keyboard;