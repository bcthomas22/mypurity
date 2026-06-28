import { useState } from "react"
import { Questionnaire } from "./Questionnaire"
import { type Rank } from "./Ranks";

function App() {

  const [currentRank, setCurrentRank] = useState<Rank | null>(null);

  return (
    <>
      {currentRank === null ? <Questionnaire setRank={(r) => setCurrentRank(r)} /> :
        <div>
          {currentRank.mainRank + " " + currentRank.subRank}
        </div>
      }
    </>
  )
}

export default App
