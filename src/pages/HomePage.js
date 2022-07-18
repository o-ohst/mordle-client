import { Link } from "react-router-dom";
import Title from "../components/Title"

function HomePage() {
  return (
    <div className="flex flex-col h-full items-center">
      <div className="h-1/4 flex-none flex justify-center">
        <Title></Title>
      </div>
      <div className="h-3/4 flex-none flex flex-col">
        <Link className="link w-fit mx-auto mt-6" to="/singleplayer">
          <button className="bg-tteal text-white hover:ring hover:ring-white hover:ring-offset-4 hover:ring-offset-tblue rounded-xl p-3 w-48 mb-6 text-2xl">
            Singleplayer
          </button>
        </Link>
        <Link className="link w-fit mx-auto" to="/multiplayer">
          <button className="bg-tpurple text-white rounded-xl p-3 w-48 text-2xl">
            Multiplayer
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
