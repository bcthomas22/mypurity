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
    | "I"
    | "II"
    | "III"
    | "IV"
    | "V"

export type Log = {
    mainLog: MainLog,
    pureSubLog: PureSubLog,
    fallenSubLog: FallenSubLog
}

export type DatePurityPair = {
    date: Date
    log: Log | null
}

export type LoggingPageSet = {
    date: Date,
    multiplier: number
}

export type VersesReadData = {
    lastDateRead: Date,
    currentStreak: number,
    total: number
}