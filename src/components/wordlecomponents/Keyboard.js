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
          letters.map((row, i) => {
            return (
              <div className="keyrow" key={i}>
                {row.map((l, x) => {
                  if (l === "🡆") {
                    return (
                      <div
                        className="key"
                        onClick={() => keyboardHandler("Enter")}
                        key={x}
                      >
                        {l}
                      </div>
                    );
                  }
                  if (l === "␡") {
                    return (
                      <div
                        className="key pb-2"
                        onClick={() => keyboardHandler("Backspace")}
                        key={x}
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
                        key={x}
                      >
                        {l}
                      </div>
                    );
                  }
                  return (
                    <div
                      className="key"
                      onClick={() => keyboardHandler(l.toLowerCase())}
                      key={x}
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