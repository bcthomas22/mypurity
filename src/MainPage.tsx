import "./styling/mainpage.css"
import { CurrentDate } from "./CurrentDate"
import { LoggingPage, YesterdaysLog } from "./Logging"
import { useState } from "react"
import { type DatePurityPair } from "./Log"
import { isSameDay } from "date-fns"
import { Ranking } from "./Ranking"
import { type Rank } from "./Ranks"

export function MainPage() {

    const [onLogging, setOnLogging] = useState<Date | null>(null);

    if (onLogging) {
        return (
            <LoggingPage date={onLogging} return={() => setOnLogging(null)}/>
        )
    }

    const logsFromLocalSer = localStorage.getItem("logs");
    const logsFromLocal: DatePurityPair[] = logsFromLocalSer === null ? [] : JSON.parse(logsFromLocalSer) 
    console.log(logsFromLocal);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1)
    const yestLog = logsFromLocal.find(log => isSameDay(yesterday, log.date))?.log ?? null;

    return (
        <div className="boxes-container">
            <Box>
                <Ranking />
            </Box>
            <Box>
                <CurrentDate />
                <p>Today is a brand new day! <br/> Jesus has forgiven all your sins!</p>
            </Box>
            <Box>
                <YesterdaysLog log={yestLog} onClick={() => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1)
                    setOnLogging(yesterday)
                }}/>
            </Box>
        </div>
    )
}

function Box(props: {children: React.ReactNode}) {
    return (
        <div className="box">
            {props.children}
        </div>
    )
}