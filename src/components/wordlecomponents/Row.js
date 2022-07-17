function Row(props) {

    if (props.guess) {
        return (
            <div className="row past">
                {props.guess.map((l, i) => (
                    <div key={i} className={ "bg-" + l.color + "-500" }>{l.key}</div>
                ))}
            </div>
        )
    }

    if (props.currentGuess) {
        let letters = props.currentGuess.split('')
        return (
            <div className="row current">
                {letters.map((letter, i) => (
                    <div key={i} className="filled">{letter}</div>
                ))}
                {[...Array(5 - letters.length)].map((u, i) => (
                    <div key={i}></div>
                ))}
            </div>
        )
    }

    return (
        <div className="row">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

export default Row;