function Grid(props) {
    console.log(props.guesses)
    return (
        <div style={{ 'display': 'flex', "flexDirection": "column", "gap": "3px" }}>
            {props.guesses.map((guessArr, i) => (<Row guess={guessArr} key={i}></Row>))}
        </div>
    );
}

function Row(props) {
    const letters = props.guess[0].split("");
    const values = props.guess[1].split("");
    const letterArrs = letters.map((e, i) => [e, values[i]]);
    console.log(letterArrs)
    return (
        <div style={{ 'display': 'flex', "gap": "3px" }}>
            {letterArrs.map((l, i) => (<Letter letterArr={l} key={i}></Letter>))}
        </div>)
}

function Letter(props) {
    const letter = props.letterArr[0];
    const value = props.letterArr[1];
    const letterStyle = { fontSize: "20px", background: "gray", width:"30px", height:"30px", border: "black 3px solid", fontWeight:"bold"};
    switch (value) {
        case '2':
            letterStyle.color = 'green'
            break;
        case '1':
            letterStyle.color = "orange"
            break;
        case '0':
            letterStyle.color = "black"
            break;
        default:
            break;
    }
    return (
        <div style={letterStyle}>
            <sp style={{"textAlign" : "center", "marginLeft": "10px"}}>{letter}</sp>
        </div>)
}

export default Grid;