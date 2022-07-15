import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <div>
        <p>
          <h1>Mordle</h1>
        </p>
        <p>
          <Link className="link" to="/singleplayer">
            <button className="button6">
              Singleplayer
              <br />
              (🚧WIP)
            </button>
          </Link>
        </p>
        <p>
          <Link className="link" to="/multiplayer">
            <button className="button6">Multiplayer</button>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default HomePage;
