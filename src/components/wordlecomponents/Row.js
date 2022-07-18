function Row(props) {

    if (props.guess) {
        return (
            <div className="row flex flex-row justify-center items-center">
                {props.guess.map((l, i) => (
                    <div key={i} className={"letterbox " + (l.color === "green" ? "bg-green-500" : l.color === "yellow" ? "bg-yellow-500" : "bg-gray-500")}>
                        <h6>{ l.key }</h6>
                    </div>
                ))}
            </div>
        )
    }

    if (props.currentGuess) {
        let letters = props.currentGuess.split('')
        return (
            <div className="row">
                {letters.map((letter, i) => (
                    <div key={i} className="letterbox text-white">
                        <h6>{letter}</h6>
                    </div>
                ))}
                {[...Array(5 - letters.length)].map((u, i) => (
                    <div key={i} className="letterbox"></div>
                ))}
            </div>
        )
    }

    return (
        <div className="row">
            <div className="letterbox"></div>
            <div className="letterbox"></div>
            <div className="letterbox"></div>
            <div className="letterbox"></div>
            <div className="letterbox"></div>
        </div>
    )
}

export default Row;