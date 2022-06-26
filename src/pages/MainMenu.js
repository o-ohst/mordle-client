import { Link } from "react-router-dom";
import classes from "./MenuPages.module.css";

function MainMenuPage() {
  return (
    <div>
      <div>
        <p>
          <h1>Mordle</h1>
        </p>
        <p>
          <Link className={classes.Link} to="/singleplayer">
            <button className={classes.button6}>Singleplayer</button>
          </Link>
        </p>
        <p>
          <Link className={classes.Link} to="/multiplayer">
            <button className={classes.button6}>Multiplayer</button>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default MainMenuPage;
