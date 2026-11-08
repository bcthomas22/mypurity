import { useState } from "react"
import { YesterdaysDate } from "./CurrentDate"
import { type DatePurityPair, type Log, type LoggingPageSet } from "./Log"
import "./styling/logpage.css"
import { changeRank } from "./Ranks"

type YesterdaysLogProps = {
    log: Log | null
    onClick(): void
}

export function YesterdaysLog(props: YesterdaysLogProps) {

    let purityColor = "#000000"

    switch (props.log?.pureSubLog) {
        case "Minimal Temptation":
            purityColor = "#81cdc5"
            break;
        case "Small Temptation":
            purityColor = "#81cdb6"
            break;
        case "Moderate Temptation":
            purityColor = "#81cda3"
            break;
        case "Lofty Temptation":
            purityColor = "#81cd8f"
            break;
        case "Heavy Temptation":
            purityColor = "#93cd81"
            break;
    }

    switch (props.log?.fallenSubLog) {
        case "I":
            purityColor = "#aa6340"
            break;
        case "II":
            purityColor = "#aa5040"
            break;
        case "III":
            purityColor = "#aa4040"
            break;
        case "IV":
            purityColor = "#aa4069"
            break;
        case "V":
            purityColor = "#aa4087"
            break;
    }

    return (
        <>
            <YesterdaysDate/>
            <h3>Yesterdays Purity</h3>
            {props.log && 
                <>
                    <div className="yesterdays-color" style={{ backgroundColor: purityColor}}></div>
                    <h4 style={{ color: purityColor}}>{props.log.mainLog}<br/>({props.log.mainLog === "Fallen" ? props.log.fallenSubLog : props.log.pureSubLog})</h4>
                </>
            }
            {!props.log &&
                <div>
                    <p>You have not yet logged yesterday's purity</p>
                    <button className="log-button" onClick={props.onClick}>Click to log</button>
                </div>
            }
        </>
        
    )
}

type WeekLogsProps = {
    logs: DatePurityPair[]
    onClick(date: Date): void
}

export function WeekLogs(props: WeekLogsProps) {
    return (
        <>
            <h2>Previous Week</h2>
            {props.logs.map((l, i) => {

                let purityColor = "#000000"

                switch (l.log?.pureSubLog) {
                    case "Minimal Temptation":
                        purityColor = "#81cdc5"
                        break;
                    case "Small Temptation":
                        purityColor = "#81cdb6"
                        break;
                    case "Moderate Temptation":
                        purityColor = "#81cda3"
                        break;
                    case "Lofty Temptation":
                        purityColor = "#81cd8f"
                        break;
                    case "Heavy Temptation":
                        purityColor = "#93cd81"
                        break;
                }

                switch (l.log?.fallenSubLog) {
                    case "I":
                        purityColor = "#aa6340"
                        break;
                    case "II":
                        purityColor = "#aa5040"
                        break;
                    case "III":
                        purityColor = "#aa4040"
                        break;
                    case "IV":
                        purityColor = "#aa4069"
                        break;
                    case "V":
                        purityColor = "#aa4087"
                        break;
                }

                const date = new Date(l.date);
                return (
                    <div key={i} className="weekly-log">

                        {l.log === null ? <button className="week-log-button" onClick={() => props.onClick(date)}>Click to log</button> :
                        <div className="week-log-color" style={{ backgroundColor: purityColor}}></div>}

                        <div className="week-log-date">{date.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                            })
                        }</div>
                    </div>
                )
            })}
        </>
        
    )
}

type PrevLogsProps = {
    logs: DatePurityPair[]
    onClick(date: Date): void
    onLoadMore(): void
}

export function PrevLogs(props: PrevLogsProps) {
    return (
        <>
            <h2>Previous Logs</h2>
            <div className="prev-log-cont">
            {props.logs.map((l, i) => {

                let purityColor = "#000000"

                switch (l.log?.pureSubLog) {
                    case "Minimal Temptation":
                        purityColor = "#81cdc5"
                        break;
                    case "Small Temptation":
                        purityColor = "#81cdb6"
                        break;
                    case "Moderate Temptation":
                        purityColor = "#81cda3"
                        break;
                    case "Lofty Temptation":
                        purityColor = "#81cd8f"
                        break;
                    case "Heavy Temptation":
                        purityColor = "#93cd81"
                        break;
                }

                switch (l.log?.fallenSubLog) {
                    case "I":
                        purityColor = "#aa6340"
                        break;
                    case "II":
                        purityColor = "#aa5040"
                        break;
                    case "III":
                        purityColor = "#aa4040"
                        break;
                    case "IV":
                        purityColor = "#aa4069"
                        break;
                    case "V":
                        purityColor = "#aa4087"
                        break;
                }

                const date = new Date(l.date);
                return (
                    <div key={i} className="prev-log">
                        {l.log === null ? <div className="prev-log-button" onClick={() => props.onClick(date)}>
                            {date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}</div> :
                        <div className="prev-log-color" style={{ backgroundColor: purityColor}}>
                            {date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </div>}
                    </div>
                )
            })}
            </div>
            <button className="load-more-button" onClick={props.onLoadMore}>Load More</button>
        </>
        
    )
}

type LoggingPageProps = {
    set: LoggingPageSet
    return(): void
}

export function LoggingPage(props: LoggingPageProps) {

    const [state, setState] = useState<"main" | "pure" | "fallen">("main");

    const submitLog = (log: Log) => {
        const logsFromLocalSer = localStorage.getItem("logs");
        const logsFromLocal: DatePurityPair[] = logsFromLocalSer === null ? [] : JSON.parse(logsFromLocalSer) 
        const newLogs = [...logsFromLocal, {date: props.set.date, log: log}]
        localStorage.setItem("logs", JSON.stringify(newLogs))

        const expEarned = (function () {
        switch (log.pureSubLog) {
            case "Minimal Temptation":
            return 110 * props.set.multiplier;
            case "Small Temptation":
            return 105 * props.set.multiplier;
            case "Moderate Temptation":
            return 100 * props.set.multiplier;
            case "Lofty Temptation":
            return 95 * props.set.multiplier;
            case "Heavy Temptation":
            return 90 * props.set.multiplier;
            default: return "fallen";
        }})();

        if (props.set.multiplier !== 0)
            changeRank(expEarned);

        props.return();
    }

    return (
        <>
        <div className="main-container">
            {state === "main" && <>
                <h3>Log your purity for the following day:</h3>
                <h2>
                    {props.set.date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                    })}
                </h2>
                <div className="selection">
                    <div className="selection-choice" onClick={() => setState("pure")}>
                        <div className="selection-color" style={{ backgroundColor: "#81cda3"}}/>
                        <div className="selection-text" style={{ color: "#81cda3"}}>Pure</div>
                    </div>
                    <div className="selection-choice" onClick={() => setState("fallen")}>
                        <div className="selection-color" style={{ backgroundColor: "#aa4040"}}/>
                        <div className="selection-text" style={{ color: "#aa4040"}}>Fallen</div>
                    </div>
                </div>

                <button className="back-button" onClick={props.return}>Back</button></>
            }
            {state === "pure" && <>
                <h3>Describe your temptation level:</h3>
                <div className="selection">
                    <div className="selection-choice" onClick={() => {submitLog({mainLog: "Pure", pureSubLog: "Minimal Temptation", fallenSubLog: null})}}>
                        <div className="selection-color" style={{ backgroundColor: "#81cdc5"}}/>
                        <div className="selection-text" style={{ color: "#81cdc5"}}>Minimal</div>
                    </div>
                    <div className="selection-choice" onClick={() => {submitLog({mainLog: "Pure", pureSubLog: "Small Temptation", fallenSubLog: null})}}>
                        <div className="selection-color" style={{ backgroundColor: "#81cdb6"}}/>
                        <div className="selection-text" style={{ color: "#81cdb6"}}>Small</div>
                    </div>
                    <div className="selection-choice" onClick={() => {submitLog({mainLog: "Pure", pureSubLog: "Moderate Temptation", fallenSubLog: null})}}>
                        <div className="selection-color" style={{ backgroundColor: "#81cda3"}}/>
                        <div className="selection-text" style={{ color: "#81cda3"}}>Moderate</div>
                    </div>
                    <div className="selection-choice" onClick={() => {submitLog({mainLog: "Pure", pureSubLog: "Lofty Temptation", fallenSubLog: null})}}>
                        <div className="selection-color" style={{ backgroundColor: "#81cd8f"}}/>
                        <div className="selection-text" style={{ color: "#81cd8f"}}>Lofty</div>
                    </div>
                    <div className="selection-choice" onClick={() => {submitLog({mainLog: "Pure", pureSubLog: "Heavy Temptation", fallenSubLog: null})}}>
                        <div className="selection-color" style={{ backgroundColor: "#93cd81"}}/>
                        <div className="selection-text" style={{ color: "#93cd81"}}>Heavy</div>
                    </div>
                </div>

                <button className="back-button" onClick={() => {setState("main")}}>Back</button></>
            }
            {state === "fallen" && <>
                <h3>{"Select on your scale todays Fallen level: (I bad, V worse)"}</h3>
                <div className="selection">
                    <div className="selection-choice" onClick={() => {submitLog({mainLog: "Fallen", pureSubLog: null, fallenSubLog: "I"})}}>
                        <div className="selection-color" style={{ backgroundColor: "#aa6340"}}/>
                        <div className="selection-text" style={{ color: "#aa6340"}}>I</div>
                    </div>
                    <div className="selection-choice" onClick={() => {submitLog({mainLog: "Fallen", pureSubLog: null, fallenSubLog: "II"})}}>
                        <div className="selection-color" style={{ backgroundColor: "#aa5040"}}/>
                        <div className="selection-text" style={{ color: "#aa5040"}}>II</div>
                    </div>
                    <div className="selection-choice" onClick={() => {submitLog({mainLog: "Fallen", pureSubLog: null, fallenSubLog: "III"})}}>
                        <div className="selection-color" style={{ backgroundColor: "#aa4040"}}/>
                        <div className="selection-text" style={{ color: "#aa4040"}}>III</div>
                    </div>
                    <div className="selection-choice" onClick={() => {submitLog({mainLog: "Fallen", pureSubLog: null, fallenSubLog: "IV"})}}>
                        <div className="selection-color" style={{ backgroundColor: "#aa4069"}}/>
                        <div className="selection-text" style={{ color: "#aa4069"}}>IV</div>
                    </div>
                    <div className="selection-choice" onClick={() => {submitLog({mainLog: "Fallen", pureSubLog: null, fallenSubLog: "V"})}}>
                        <div className="selection-color" style={{ backgroundColor: "#aa4087"}}/>
                        <div className="selection-text" style={{ color: "#aa4087"}}>V</div>
                    </div>
                </div>

                <button className="back-button" onClick={() => {setState("main")}}>Back</button></>
            }
        </div>
        </>
    )
}