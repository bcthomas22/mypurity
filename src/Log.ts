export type MainLog =
    | "Pure"
    | "Fallen"

export type PureSubLog =
    | null
    | "Minimal Temptation"
    | "Small Temptation"
    | "Moderate Temptation"
    | "Lofty Temptation"
    | "Heavy Temptation"

export type FallenSubLog =
    | null
    | "Mast......"
    | "Lew. Ima..."
    | "Wat.... Po.."
    | "Ha. Se."
    | "Something Unspeakable"

export type Log = {
    mainLog: MainLog,
    pureSubLog: PureSubLog,
    fallenSubLog: FallenSubLog
}

export type DatePurityPair = {
    date: Date
    log: Log
}