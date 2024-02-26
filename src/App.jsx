import { useEffect, useState, } from "react";
import { StartScreen, PlayScreen, Levels, Scores, Pause, PlayScreenHard, PlayScreenMId, Gameover } from "./Screens";


function App() {
  const [gameState, setGameState] = useState("start");
  const [score,setScore]=useState(0)

  useEffect(()=>{
    setScore(0)
  },[])
     
   
  

  switch (gameState) {
    case "start":
      return <StartScreen start={() => setGameState("levels")}  />;
    case "levels":
      return <Levels  start={() => setGameState("play")} hard={() => setGameState("hard")} mid={() => setGameState("mid")} />;  
    case "play":
      return <PlayScreen end={() => setGameState("score")}   over={() => setGameState("gameover")}   score={score} setScore={setScore}/>;
    case "score":
      return <Scores end={() => setGameState("start")}  score={score} />;
    case "hard":
      return <PlayScreenHard  end={() => setGameState("score")}   over={() => setGameState("gameover")}  score={score} setScore={setScore} />;
    case "mid":
      return <PlayScreenMId  end={() => setGameState("score")}  over={() => setGameState("gameover")}    score={score} setScore={setScore} />;
    case "gameover":
       return <Gameover end={() => setGameState("start")}  score={score}/>
       

  }

    
}
  
export default App;
