import { type Rank} from "./Ranks";
import { useState, type ChangeEvent } from 'react';
import './styling/questionnaire.css'

type QuestionnaireProps = {
    setRank(rank: Rank): void 
}

type QuestionnaireState = {
    m_month: number
    m_week: number
    wp_month: number
    wp_week: number
    hs_month: number
    hs_week: number
    unspoken: number
}

export function Questionnaire(props: QuestionnaireProps) {

    const initState: QuestionnaireState = {
        m_month: 0,
        m_week: 0,
        wp_month: 0,
        wp_week: 0,
        hs_month: 0,
        hs_week: 0,
        unspoken: 0
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
            question: "How many times have you [m] in the last month? Approximate",
            min: 0,
            max: 30,
            current: state.m_month,
            change: (n) => setState({...state, m_month: n})
        },
        {
            question: "How many times have you [m] in the last week? Approximate",
            min: 0,
            max: 7,
            current: state.m_week,
            change: (n) => setState({...state, m_week: n})
        },
        {
            question: "How many times have you [wp] in the last month? Approximate",
            min: 0,
            max: 30,
            current: state.wp_month,
            change: (n) => setState({...state, wp_month: n})
        },
        {
            question: "How many times have you [wp] in the last week? Approximate",
            min: 0,
            max: 7,
            current: state.wp_week,
            change: (n) => setState({...state, wp_week: n})
        },
        {
            question: "How many times have you [hs] in the last month? Approximate",
            min: 0,
            max: 30,
            current: state.hs_month,
            change: (n) => setState({...state, hs_month: n})
        },
        {
            question: "How many times have you [hs] in the last week? Approximate",
            min: 0,
            max: 7,
            current: state.hs_week,
            change: (n) => setState({...state, hs_week: n})
        },
        {
            question: "How many times have you done something completely worse in the past month (Something horrible).",
            min: 0,
            max: 1,
            current: state.unspoken,
            change: (n) => setState({...state, unspoken: n})
        },
    ]

    const getRankFromQuestions = (submission: QuestionnaireState): Rank => {

        let totalPoints = 0;
        totalPoints += submission.unspoken * 300
        totalPoints += submission.hs_week * 30
        totalPoints += submission.hs_month * 25
        totalPoints += submission.wp_week * 25
        totalPoints += submission.wp_month * 22
        totalPoints += submission.m_week * 20
        totalPoints += submission.m_month * 18

        if (totalPoints >= 300)
            return {mainRank: "Purity", subRank: null, fruits: null, progress: 100}

        if (totalPoints >= 200)
            return {mainRank: "Soil", subRank: "Mature", fruits: null, progress: 100}

        if (totalPoints >= 100)
            return {mainRank: "Seed", subRank: "Mature", fruits: null, progress: 100}

        if (totalPoints >= 50)
            return {mainRank: "Root", subRank: "Mature", fruits: null, progress: 100}

        return {mainRank: "Sprout", subRank: "Mature", fruits: null, progress: 100}
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
                Please indicate how "pure" you are by answering the following questions. Nothing answered here will be tracked or stored.
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
                {props.currentSliderValue + (props.currentSliderValue === props.maxSliderValue ? "+" : "") + " time" + (props.currentSliderValue === 1 ? "" : "s")}
            </div>
        </div>
    )
}