export type MainRank =
    | "rank1"
    | "rank2"
    | "rank3"
    | "rank4"
    | "rank5"
    | "rank6"
    | "rank7"
    | "rank8"
    | "rank9"
    | "rank10"

export type SubRank =
    | "sub-rank1"
    | "sub-rank2"
    | "sub-rank3"
    | "sub-rank4"

export type Rank = {
    mainRank: MainRank
    subRank: SubRank
}