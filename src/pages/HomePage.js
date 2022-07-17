import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <p>
        <h1 className="font-jost font-bold">Mordle</h1>
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
  );
}

export default HomePage;
