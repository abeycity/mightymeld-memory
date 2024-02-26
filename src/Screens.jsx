import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <div className="flex  justify-center items-center h-[100vh] w-full ">
      <div className="flex justify-center items-center p-5 bg-pink-100 rounded-lg">
        <div className="flex flex-col  justify-center gap-8 text-center p-6">
          <h4 className="text-pink-500 font-bold text-4xl">Memory</h4>
          <p className="text-lg text-pink-400 font-bold">
            Flip over tiles looking for pairs
          </p>
          <div>
            <button
              onClick={start}
              className="bg-pink-500 text-white py-2 rounded-full px-12 text-lg shadow-inner-lg ring-pink-600 ring-2 my-4"
            >
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Levels({ start, mid, hard }) {
  return (
    <>
      <div className={" flex justify-center items-center h-[100vh] shadow"}>
        <div className="bg-pink-200 p-6 text-center rounded-lg shadow ring-2 ring-gray-100">
          <div className="flex flex-col justify-center text-center gap-2">
            <h3 className="text-2xl font-bold">Choose Level</h3>
            <button
              onClick={start}
              className="border bg-pink-900  rounded-full  w-[300px] px-4 py-4 my-2 hover:bg-pink-600 text-gray-200 text-center"
            >
              easy
            </button>
            <button
              onClick={mid}
              className="border bg-blue-900  rounded-full  w-[300px] px-4 py-4 my-2 hover:bg-blue-700 text-gray-200 text-lg font-medium text-center"
            >
              medium
            </button>
            <button
              onClick={hard}
              className="border bg-green-700  rounded-full  w-[300px] px-4 py-4 my-2 hover:bg-green-500 text-gray-200 text-center"
            >
              Hard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function PlayScreen({  over, end, score, setScore }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(25);
  const [hint, setHint] = useState(7);

  useEffect(() => {
    setScore(0);
  }, []);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((tryCount) => tryCount - 1);
      if (tryCount === 1) {
        setTimeout(over, 1500);
      }

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
        setScore((score) => score + 25);
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 1000);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  const showAllCArd = () => {
    const prevState = tiles;
    setTiles((prevTiles) =>
      prevTiles.map((tile) => ({
        ...tile,
        state: tile.state === "matched" ? "matched" : "matched",
      }))
    );

    setTimeout(() => {
      setTiles(prevState);
    }, 1000);

    setHint((hint) => hint - 1);
  };

  return (
    <>
      
      <div className="flex flex-col  gap-6 justify-center items-center h-[100vh]">
        <div className="flex justify-end gap-[2rem] items-center">
          <div className="flex gap-2 items-center">
            <h3 className="text-lg font-bold sans">remaining trials</h3>
            <div className="bg-blue-500 px-2 py-1 rounded-lg text-lg font-medium shadow ring-2 ring-gray-300">
              {tryCount}
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <h3 className="sans text-lg font-bold">score</h3>
            <div className="bg-blue-400 py-1 px-3 rounded-lg shadow ring ring-gray-200">
              {score}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 bg-blue-100 p-2 rounded-lg">
          {getTiles(16).map((tile, i) => (
            <div className="" key={i}>
              <Tile key={i} flip={() => flip(i)} {...tile} />
            </div>
          ))}
        </div>
        {hint >= 1 ? (
          <>
            <div className="flex gap-2 bg-blue-300 rounded-lg py-2 px-4">
              <button
                onClick={showAllCArd}
                className="hover:bg-blue-600 px-4 rounded-full"
              >
                hints{" "}
              </button>
              {hint}
            </div>
          </>
        ) : (
          <button disabled
          className="bg-blue-400 rounded-lg px-4 py-2">you have no hint left </button>
        )}
      </div>
    </>
  );
}
export function PlayScreenMId({  over, end, score, setScore }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(22);
  const [hint, setHint] = useState(5);
  useEffect(() => {
    setScore(0);
  }, []);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((tryCount) => tryCount - 1);
      if (tryCount === 1) {
        setTimeout(over, 1500);
      }

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
        setScore((score) => score + 25);
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 1000);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };
  const showAllCArd = () => {
    const prevState = tiles;
    setTiles((prevTiles) =>
      prevTiles.map((tile) => ({
        ...tile,
        state: tile.state === "matched" ? "matched" : "matched",
      }))
    );

    setTimeout(() => {
      setTiles(prevState);
    }, 1000);

    setHint((hint) => hint - 1);
  };

  return (
    <>
  
      <div className="flex flex-col  gap-6 justify-center items-center h-[100vh]">
        <div className="flex justify-end gap-[2rem] items-center">
          <div className="flex gap-2 items-center">
            <h3 className="text-lg font-bold sans">remaining trials</h3>
            <div className="bg-blue-500 px-2 py-1 rounded-lg text-lg font-medium shadow ring-2 ring-gray-300">
              {tryCount}
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <h3 className="sans text-lg font-bold">score</h3>
            <div className="bg-blue-400 py-1 px-3 rounded-lg shadow ring ring-gray-200">
              {score}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 bg-blue-100 p-2 rounded-lg">
          {getTiles(16).map((tile, i) => (
            <div className="" key={i}>
              <Tile key={i} flip={() => flip(i)} {...tile} />
            </div>
          ))}
        </div>
        {hint >= 1 ? (
          <button
            onClick={showAllCArd}
            className="bg-blue-400 rounded-lg px-4 py-2 hover:bg-blue-500"
          >
            hints {hint}
          </button>
        ) : (
          <button disabled
           className="bg-blue-400 rounded-lg px-4 py-2" >you have no hint left </button>
        )}
      </div>
    </>
  );
}

export function PlayScreenHard({  end, over, score, setScore }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(20);
  const [hint, setHint] = useState(2);

  useEffect(() => {
    setScore(0);
  }, []);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((tryCount) => tryCount - 1);
      if (tryCount === 1) {
        setTimeout(over, 1500);
      }

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
        setScore((score) => score + 25);
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 1000);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };
  const showAllCArd = () => {
    const prevState = tiles;
    setTiles((prevTiles) =>
      prevTiles.map((tile) => ({
        ...tile,
        state: tile.state === "matched" ? "matched" : "matched",
      }))
    );

    setTimeout(() => {
      setTiles(prevState);
    }, 1000);

    setHint((hint) => hint - 1);
  };

  return (
    <>
     
      <div className="flex flex-col  gap-6 justify-center items-center h-[100vh]">
        <div className="flex justify-end gap-[2rem] items-center">
          <div className="flex gap-2 items-center">
            <h3 className="text-lg font-bold sans">remaining trials</h3>
            <div className="bg-blue-500 px-2 py-1 rounded-lg text-lg font-medium shadow ring-2 ring-gray-300">
              {tryCount}
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <h3 className="sans text-lg font-bold">score</h3>
            <div className="bg-blue-400 py-1 px-3 rounded-lg shadow ring ring-gray-200">
              {score}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 bg-blue-100 p-2 rounded-lg">
          {getTiles(16).map((tile, i) => (
            <div className="" key={i}>
              <Tile key={i} flip={() => flip(i)} {...tile} />
            </div>
          ))}
        </div>
        {hint >= 1 ? (
          <button
            onClick={showAllCArd}
            className="bg-blue-400 rounded-lg px-4 py-2 hover:bg-blue-500"
          >
            hints {hint}
          </button>
        ) : (
          <button  disabled
            className="bg-blue-400 rounded-lg px-4 py-2">you have no hint left </button>
        )}
      </div>
    </>
  );
}

export function Scores({ score, end }) {
  return (
    <>
      <div className="flex justify-center items-center h-[100vh]">
        <div className="bg-pink-200 p-10 roundeded-lg shadow-2 ring ring-pink-100">
          <div className="flex flex-col gap-8">
          <h3 className="text-4xl font-bold text-center sans text-pink-700">
                Congratulations!
            </h3>
            <div className="flex gap-2 items-center border border-gray-300 rounded-lg bg-blue-400 py-4 px-2 justify-center shadow ring-2 ring-black-600">
              <h4 className="text-lg font-bold serif ">your score is </h4>
              <div className="text-2xl font-bold sans ">{score}</div>
            </div>
            <div className="flex justify-center w-full ">
              <button
                className="h-12 rounded-full bg-slate-900 px-6 font-semibold tracking-wider text-white hover:bg-slate-600"
                onClick={end}
              >
                go back to home
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export function Gameover({ score ,end}) {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="flex flex-col gap-8 p-12 bg-pink-200 rounded-2xl">
        <h3 className="text-4xl font-bold text-center sans text-pink-700">
          Game Over!
        </h3>
        <div className="bg-green-400 h-1 w-[full] rounded-full shadow" />

        <div className="flex items-center gap-2 text-center justify-center">
          <p className="text-2xl font-bold">your score is</p>
          <p className="text-4xl text-bold text-blue-600">{score}</p>
        </div>

        <div className="flex justify-center w-full">
          <button
            className="h-12 rounded-full bg-slate-900 px-6 font-semibold tracking-wider text-white hover:bg-slate-600 w-full"
            onClick={end}
          >
            mainmenu
          </button>
         
        </div>
      </div>
    </div>
  );
}
export function Pause() {
  return <div>pause</div>;
}
