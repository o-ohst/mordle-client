import Row from "./Row";

function Grid(props) {
    return <div className="flex flex-col kgrid" >
        {props.guesses.map((g, i) => {
            if (props.row === i) {
                return <Row key={i} currentGuess={props.currentGuess} />
            }
            return <Row key={i} guess={g} />
        })}
    </div>
}

export default Grid;