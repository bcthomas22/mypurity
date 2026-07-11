import { type Rank, pointsNeededToRankUp } from "./Ranks"

export function Ranking() {
    
    const rankFromLocalSer = localStorage.getItem("rank");
    const rankFromLocal: Rank = rankFromLocalSer === null ? null : JSON.parse(rankFromLocalSer);
    
    return (
    <>
        <h2>Current Rank:</h2>
        {rankFromLocal.subRank && <h3>{rankFromLocal.subRank}</h3>}
        <h1>{rankFromLocal.mainRank}</h1>
        {rankFromLocal.fruits && <h3>Fruits: {rankFromLocal.fruits}</h3>}
        <p>Progress: {(rankFromLocal.progress/pointsNeededToRankUp(rankFromLocal.mainRank) * 100).toPrecision()}%</p>
    </>
    )
}