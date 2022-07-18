function MessageDisplay(props) {
    if (props.message !== "") {
        return (
            <h3 className="text-center text-torange">{props.message}</h3>
        )
    } else {
        return (<h3 className = "text-center">&nbsp;</h3>)
    }
}

export default MessageDisplay;