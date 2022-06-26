import { Link } from "react-router-dom";
import classes from "./MenuPages.module.css";

function SingleplayerPage() {
  return (
    <div>
      <div>
        <p>
          <h1>Mordle</h1>
        </p>
        <p>
          <h3>Singleplayer</h3>
        </p>
        <p>
          <Link className={classes.Link} to="/singleplayer/wordle">
            <button className={classes.button6}>Wordle</button>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SingleplayerPage;
