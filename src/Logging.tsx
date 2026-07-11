import { useState } from "react"
import { YesterdaysDate } from "./CurrentDate"
import { type DatePurityPair, type Log } from "./Log"
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
        case "Mast......":
            purityColor = "#aa6340"
            break;
        case "Lew. Ima...":
            purityColor = "#aa5040"
            break;
        case "Wat.... Po..":
            purityColor = "#aa4040"
            break;
        case "Ha. Se.":
            purityColor = "#aa4069"
            break;
        case "Something Unspeakable":
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

type LoggingPageProps = {
    date: Date
    return(): void
}

export function LoggingPage(props: LoggingPageProps) {

    const [state, setState] = useState<"main" | "pure" | "fallen">("main");

    const submitLog = (log: Log) => {
        const logsFromLocalSer = localStorage.getItem("logs");
        const logsFromLocal: DatePurityPair[] = logsFromLocalSer === null ? [] : JSON.parse(logsFromLocalSer) 
        const newLogs = [...logsFromLocal, {date: props.date, log: log}]
        localStorage.setItem("logs", JSON.stringify(newLogs))

        const expEarned = (function () {
        switch (log.pureSubLog) {
            case "Minimal Temptation":
            return 110;
            case "Small Temptation":
            return 105;
            case "Moderate Temptation":
            return 100;
            case "Lofty Temptation":
            return 95;
            case "Heavy Temptation":
            return 90;
            default: return "fallen";
        }})();

        changeRank(expEarned);

        props.return();
    }

    return (
        <>
        <div className="main-container">
            {state === "main" && <>
                <h3>Log your purity for the following day:</h3>
                <h2>
                    {props.date.toLocaleDateString('en-US', {
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
                <h3>Describe your temptation level</h3>
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
                <h3>Describe your activity</h3>
                <div className="selection">
                    <div className="selection-choice" onClick={() => {submitLog({mainLog: "Fallen", pureSubLog: null, fallenSubLog: "Mast......"})}}>
                        <div className="selection-color" style={{ backgroundColor: "#aa6340"}}/>
                        <div className="selection-text" style={{ color: "#aa6340"}}>Mast....</div>
                    </div>
                    <div className="selection-choice" onClick={() => {submitLog({mainLog: "Fallen", pureSubLog: null, fallenSubLog: "Lew. Ima..."})}}>
                        <div className="selection-color" style={{ backgroundColor: "#aa5040"}}/>
                        <div className="selection-text" style={{ color: "#aa5040"}}>Lew. Ima..</div>
                    </div>
                    <div className="selection-choice" onClick={() => {submitLog({mainLog: "Fallen", pureSubLog: null, fallenSubLog: "Wat.... Po.."})}}>
                        <div className="selection-color" style={{ backgroundColor: "#aa4040"}}/>
                        <div className="selection-text" style={{ color: "#aa4040"}}>Wha.. Po..</div>
                    </div>
                    <div className="selection-choice" onClick={() => {submitLog({mainLog: "Fallen", pureSubLog: null, fallenSubLog: "Ha. Se."})}}>
                        <div className="selection-color" style={{ backgroundColor: "#aa4069"}}/>
                        <div className="selection-text" style={{ color: "#aa4069"}}>Ha. Se.</div>
                    </div>
                    <div className="selection-choice" onClick={() => {submitLog({mainLog: "Fallen", pureSubLog: null, fallenSubLog: "Something Unspeakable"})}}>
                        <div className="selection-color" style={{ backgroundColor: "#aa4087"}}/>
                        <div className="selection-text" style={{ color: "#aa4087"}}>Worse</div>
                    </div>
                </div>

                <button className="back-button" onClick={() => {setState("main")}}>Back</button></>
            }
        </div>
        </>
    )
}