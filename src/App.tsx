import { useState } from "react"
import { Questionnaire } from "./Questionnaire"
import { type Rank } from "./Ranks";
import { MainPage } from "./MainPage";

function App() {

  const rankFromLocalSer = localStorage.getItem("rank");
  const rankFromLocal: Rank | null = rankFromLocalSer === null ? null : JSON.parse(rankFromLocalSer) 
  const [currentRank, setCurrentRank] = useState<Rank | null>(rankFromLocal)

  const setInitialRank = (r: Rank) => {
    setCurrentRank(r)
    localStorage.setItem("rank", JSON.stringify(r))
  }

  return (
    <>
      {currentRank === null ? <Questionnaire setRank={setInitialRank} /> :
        <MainPage />
      }
    </>
  )
}

export default App
