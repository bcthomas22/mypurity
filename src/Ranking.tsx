import { useEffect, useState } from "react";
import { type Rank, pointsNeededToRankUp, nextRank } from "./Ranks"

export function Ranking() {
    
    const rankFromLocalSer = localStorage.getItem("rank");
    const rankFromLocal: Rank = rankFromLocalSer === null ? null : JSON.parse(rankFromLocalSer);

    const oldRankFromLocalSer = localStorage.getItem("prev-rank");
    const oldRankFromLocal: Rank = oldRankFromLocalSer === null ? null : JSON.parse(oldRankFromLocalSer);

    const rankedUp: boolean = nextRank(oldRankFromLocal.mainRank) === rankFromLocal.mainRank;
    const rankedDown: boolean = oldRankFromLocal.mainRank === nextRank(rankFromLocal.mainRank);
    const rankdiff: number = rankedUp 
        ? pointsNeededToRankUp(oldRankFromLocal.mainRank) - oldRankFromLocal.progress + 100 
        : rankFromLocal.progress - oldRankFromLocal.progress;

    const [displayedRank, setDisplayedRank] = useState<Rank>(oldRankFromLocal);
    const [displayedDiff, setDisplayedDiff] = useState<number>(rankdiff);

    useEffect(() => {
        if (displayedDiff === 0 || rankedDown) {
            setDisplayedRank(rankFromLocal); 
            setDisplayedDiff(0);
            return;
        };

        const totalSteps = Math.abs(displayedDiff);
        const stepDirection = displayedDiff > 0 || rankedUp ? -1 : 1;
        let currentStep = 0;
        let timer: any;

        const delayTime = setTimeout(() => {
            timer = setInterval(() => {
            currentStep++;

            if (currentStep > totalSteps) {
                clearInterval(timer);
                setDisplayedRank(rankFromLocal); 
                return;
            }

            setDisplayedRank((prev) => ({
                ...((prev.progress - stepDirection) > pointsNeededToRankUp(oldRankFromLocal.mainRank) ? rankFromLocal : prev),
                progress: (prev.progress - stepDirection) > pointsNeededToRankUp(oldRankFromLocal.mainRank) 
                    ? prev.progress - stepDirection - pointsNeededToRankUp(oldRankFromLocal.mainRank)
                    : prev.progress - stepDirection
            }));
            setDisplayedDiff((prev) => prev + stepDirection);
        }, 10);
        }, 500);
        
        return () => {
            clearTimeout(delayTime);
            if (timer) clearInterval(timer);
        };
    }, []); 
    
    return (
    <>
        <h2>Current Growth:</h2>
        {displayedRank.subRank && <h3>{displayedRank.subRank}</h3>}
        <h1>{displayedRank.mainRank}</h1>
        {displayedRank.fruits && <h3>Fruits: {displayedRank.fruits}</h3>}
        <div className="outer-rank-progress">
            <div className="inner-rank-progress" style={{width: `${displayedRank.progress / pointsNeededToRankUp(displayedRank.mainRank) * 100}%`}}>

            </div>
            <p className="progress-text">{displayedRank.progress + " / " + pointsNeededToRankUp(displayedRank.mainRank)}</p>
            <p className="added-progress-text">{displayedDiff > 0 && `+${displayedDiff}`}</p>
        </div>
    </>
    )
}