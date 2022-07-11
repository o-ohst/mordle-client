function MessageDisplay(props) {
    if (props.message !== "") {
        return (
            <h4>{props.message}</h4>
        )
    }
    return (
        <h4>___________</h4>
    );
}

export default MessageDisplay;