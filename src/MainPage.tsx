import "./styling/mainpage.css"
import { CurrentDate } from "./CurrentDate"
import { LoggingPage, YesterdaysLog, PrevLogs, WeekLogs } from "./Logging"
import { useState } from "react"
import { type DatePurityPair, type LoggingPageSet } from "./Log"
import { isSameDay } from "date-fns"
import { Ranking } from "./Ranking"
import VerseWidget from "./VerseWidget"

export function MainPage() {

    const [onLogging, setOnLogging] = useState<LoggingPageSet | null>(null);
    const [loadMoreCount, setLoadMoreCount] = useState<number>(0);

    if (onLogging) {
        return (
            <LoggingPage set={onLogging} return={() => setOnLogging(null)}/>
        )
    }

    const logsFromLocalSer = localStorage.getItem("logs");
    const logsFromLocal: DatePurityPair[] = logsFromLocalSer === null ? [] : JSON.parse(logsFromLocalSer);
    const trackedDate = new Date();
    trackedDate.setDate(trackedDate.getDate() - 1)
    const yestLog = logsFromLocal.find(log => isSameDay(trackedDate, log.date)) ?? null;

    const weekLogs: DatePurityPair[] = [];
    weekLogs.push({date: new Date(trackedDate), log: yestLog?.log ?? null});
    for(let i=0; i<6; i++){
        trackedDate.setDate(trackedDate.getDate() - 1);
        weekLogs.push({date: new Date(trackedDate), log: (logsFromLocal.find(log => isSameDay(trackedDate, log.date))?.log ?? null)});
    }

    const prevLogs: DatePurityPair[] = [];
    for(let i=0; i<43 + loadMoreCount; i++){
        trackedDate.setDate(trackedDate.getDate() - 1);
        prevLogs.push({date: new Date(trackedDate), log: (logsFromLocal.find(log => isSameDay(trackedDate, log.date))?.log ?? null)});
    }


    return (
        <div className="boxes-container">
            <Box>
                <Ranking />
            </Box>
            <Box>
                <CurrentDate />
                <p>Today is a brand new day! <br/> Jesus has forgiven all your sins!</p>
                <VerseWidget />
            </Box>
            <Box>
                <YesterdaysLog log={yestLog?.log ?? null} onClick={() => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    setOnLogging({multiplier: 1, date: yesterday});
                }}/>
            </Box>
            <Box>
                <WeekLogs logs={weekLogs} onClick={(date)=>{setOnLogging({multiplier: 0.8, date: new Date(date)})}} />
            </Box>
            <Box>
                <PrevLogs logs={prevLogs} onClick={(date)=>{setOnLogging({multiplier: 0, date: new Date(date)})}} onLoadMore={() => setLoadMoreCount(prev => prev + 50)} />
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