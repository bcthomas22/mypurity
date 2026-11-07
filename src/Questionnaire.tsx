import { type Rank} from "./Ranks";
import { useState, type ChangeEvent } from 'react';
import './styling/questionnaire.css'

type QuestionnaireProps = {
    setRank(rank: Rank): void 
}

type QuestionnaireState = {
    rate_month: number
    rate_week: number
}

export function Questionnaire(props: QuestionnaireProps) {

    const initState: QuestionnaireState = {
        rate_month: 1,
        rate_week: 1
    }

    const [state, setState] = useState<QuestionnaireState>(initState)

    type MappedQuestion = {
        question: string;
        min: number
        max: number
        current: number
        change(n: number): void
    }
    const allQuestions: MappedQuestion[] = [
        {
            question: "On your scale, rate how your purity has been in the last MONTH (1 bad, 10 good)",
            min: 1,
            max: 10,
            current: state.rate_month,
            change: (n) => setState({...state, rate_month: n})
        },
        {
            question: "On your scale, rate how your purity has been in the last WEEK (1 bad, 10 good)",
            min: 1,
            max: 10,
            current: state.rate_week,
            change: (n) => setState({...state, rate_week: n})
        }
    ]

    const getRankFromQuestions = (submission: QuestionnaireState): Rank => {

        let totalPoints = 0;
        totalPoints += submission.rate_month * 3
        totalPoints += submission.rate_week * 7

        if (totalPoints >= 100)
            return {mainRank: "Sprout", subRank: null, fruits: null, progress: 100}

        if (totalPoints >= 75)
            return {mainRank: "Root", subRank: "Mature", fruits: null, progress: 100}

        if (totalPoints >= 50)
            return {mainRank: "Seed", subRank: "Mature", fruits: null, progress: 100}

        if (totalPoints >= 25)
            return {mainRank: "Soil", subRank: "Mature", fruits: null, progress: 100}

        return {mainRank: "Purity", subRank: "Mature", fruits: null, progress: 100}
    }

    const submit = () => {
        const myRank = getRankFromQuestions(state)
        props.setRank(myRank)
    }

    return (
        <div className="questions">
            <div className="questionnaire-text">
                Questionnaire
            </div>
            <div className="questionnaire-prompt">
                Please indicate your purity by answering the following questions. Nothing answered here will be tracked or stored.
            </div>
            {allQuestions.map((q, i) => 
                <Question 
                    key={i}
                    question={q.question}
                    minSliderValue={q.min}
                    maxSliderValue={q.max}
                    currentSliderValue={q.current}
                    setCurrentSliderValue={q.change}
                />
            )}
            <button 
                className="submit-questionnaire"
                onClick={submit}
            >Submit</button>
        </div>
    )
}

type QuestionProps = {
    question: string
    minSliderValue: number
    maxSliderValue: number
    currentSliderValue: number
    setCurrentSliderValue(n: number): void
}

function Question(props: QuestionProps) {
    
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        props.setCurrentSliderValue(Number(event.target.value));
    };

    return (
        <div className="question-box">
            <div className="question-text">
                {props.question}
            </div>
            <div>
                <input className="question-slider"
                    type="range" 
                    min={props.minSliderValue}
                    max={props.maxSliderValue}
                    value={props.currentSliderValue}
                    onChange={handleChange}
                    step="1">
                </input>
            </div>
            <div className="question-input-amount">
                {props.currentSliderValue}
            </div>
        </div>
    )
}