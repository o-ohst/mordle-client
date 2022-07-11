import Row from "./Row";

function Grid(props) {
    return <div>
        {props.guesses.map((g, i) => {
            if (props.turn === i) {
                return <Row key={i} currentGuess={props.currentGuess} />
            }
            return <Row key={i} guess={g} />
        })}
    </div>
}

export default Grid;