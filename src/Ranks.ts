import { previousFriday } from "date-fns"

export type MainRank =
    | "Purity"
    | "Soil"
    | "Seed"
    | "Root"
    | "Sprout"
    | "Sapling"
    | "Branch"
    | "Foliage"
    | "Blossom"
    | "Fruit"

//Purity and Fruit rank doesnt have a SubRank
export type SubRank =
    | null
    | "Decayed"
    | "Mature"
    | "Florishing"
    | "Thriving"

//Fruits represents the pristige of Fruit rank
export type Fruits = 
    | null
    | number

export type Rank = {
    mainRank: MainRank
    subRank: SubRank
    fruits: Fruits
    progress: number
}

export function nextRank(mainRank: MainRank): MainRank {
    switch (mainRank) {
        case "Purity":
            return "Soil";
        case "Soil":
            return "Seed";
        case "Seed":
            return "Root";
        case "Root":
            return "Sprout";
        case "Sprout":
            return "Sapling";
        case "Sapling":
            return "Branch";
        case "Branch":
            return "Foliage";
        case "Foliage":
            return "Blossom";
        case "Blossom":
            return "Fruit";
        case "Fruit":
            return "Fruit";
    }
}

export function prevRank(mainRank: MainRank): MainRank {
    switch (mainRank) {
        case "Purity":
            return "Purity";
        case "Soil":
            return "Purity";
        case "Seed":
            return "Soil";
        case "Root":
            return "Seed";
        case "Sprout":
            return "Root";
        case "Sapling":
            return "Sprout";
        case "Branch":
            return "Sapling";
        case "Foliage":
            return "Branch";
        case "Blossom":
            return "Foliage";
        case "Fruit":
            return "Blossom";
    }
}

export function pointsNeededToRankUp(mainRank: MainRank) {
    switch (mainRank) {
        case "Purity":
            return 150;
        case "Soil":
            return 400;
        case "Seed":
            return 800;
        case "Root":
            return 1500;
        case "Sprout":
            return 2200;
        case "Sapling":
            return 3100;
        case "Branch":
            return 5100;
        case "Foliage":
            return 7600;
        case "Blossom":
            return 10100;
        case "Fruit":
            //you get 1 fruit every 10ish days
            return 1000;
    }
}

export function getSubRankFromPoints(mainRank: MainRank, progress: number): SubRank {
    if (mainRank === "Purity" || mainRank === "Fruit")
        return null;

    if (progress < 100)
        return "Decayed"

    const pointsNeeded = pointsNeededToRankUp(mainRank)
    const percentThere = progress / pointsNeeded;

    if (percentThere < 0.3)
        return "Mature"

    if (percentThere < 0.6)
        return "Florishing"

    return "Thriving"
}

export function changeRank(amount: number | "fallen") {
    const rankFromLocalSer = localStorage.getItem("rank");
    const rankFromLocal: Rank = rankFromLocalSer === null ? null : JSON.parse(rankFromLocalSer);

    const getNewRank = (): Rank => {
        if (amount === "fallen") {
            if(rankFromLocal.subRank === "Decayed"){
                return {
                    mainRank: prevRank(rankFromLocal.mainRank),
                    subRank: prevRank(rankFromLocal.mainRank) === "Purity" ? null : "Mature",
                    progress: 100,
                    fruits: null
                }
            }
            if(rankFromLocal.mainRank === "Fruit")
            {
                return {
                    mainRank: "Blossom",
                    subRank: "Mature",
                    progress: 100,
                    fruits: null
                }
            }
            if(rankFromLocal.mainRank === "Purity")
            {
                return {
                    mainRank: "Purity",
                    subRank: null,
                    progress: rankFromLocal.progress === 0 ? 0 : rankFromLocal.progress - 1,
                    fruits: null
                }
            }
            return {
                mainRank: rankFromLocal.mainRank,
                subRank: "Decayed",
                progress: 50,
                fruits: null
            }
        }

        if (rankFromLocal.progress + amount >= pointsNeededToRankUp(rankFromLocal.mainRank))
        {
            if (rankFromLocal.mainRank === "Fruit"){
                return{
                    mainRank: "Fruit",
                    subRank: null,
                    progress: amount - (pointsNeededToRankUp(rankFromLocal.mainRank) - rankFromLocal.progress),
                    fruits: rankFromLocal.fruits === null ? 1 : rankFromLocal.fruits + 1
                }
            }
            return {
                mainRank: nextRank(rankFromLocal.mainRank),
                subRank: nextRank(rankFromLocal.mainRank) === "Fruit" ? null : "Mature",
                progress: nextRank(rankFromLocal.mainRank) === "Fruit" ? 0 : 100,
                fruits: nextRank(rankFromLocal.mainRank) === "Fruit" ? 1 : null
            }
        }

        return {
            mainRank: rankFromLocal.mainRank,
            subRank: getSubRankFromPoints(rankFromLocal.mainRank, rankFromLocal.progress + amount),
            progress: rankFromLocal.progress + amount,
            fruits: rankFromLocal.fruits
        }
    }

    const newRank = getNewRank();
    localStorage.setItem("rank", JSON.stringify(newRank))

}