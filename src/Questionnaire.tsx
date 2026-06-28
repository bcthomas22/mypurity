import {type MainRank, type Rank} from "./Ranks";
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

    const getRankFromQuestions = (submission: QuestionnaireState): MainRank => {
        if (submission.unspoken > 0){
            return "rank1"
        }

        const m_perDayOld = submission.m_month / 30;
        const m_perDayNew = submission.m_week / 7;
        const wp_perDayOld = submission.wp_month / 30;
        const wp_perDayNew = submission.wp_week / 7;
        const hs_perDayOld = submission.hs_month / 30;
        const hs_perDayNew = submission.hs_week / 7;

        const m_growth = m_perDayOld - m_perDayNew;
        const wp_growth = wp_perDayOld - wp_perDayNew;
        const hs_growth = hs_perDayOld - hs_perDayNew;

        if (hs_perDayNew + hs_perDayOld - (hs_growth/2) > 0.8)
            return "rank2"

        if (hs_perDayNew + hs_perDayOld - (hs_growth/2) > 0)
            return "rank3"

        if (wp_perDayNew + wp_perDayOld - (wp_growth/2) > 0.8)
            return "rank4"

        if (wp_perDayNew + wp_perDayOld - (wp_growth/2) > 0)
            return "rank5"

        if (m_perDayNew + m_perDayOld - (m_growth/2) > 1)
            return "rank6"

        if (m_perDayNew + m_perDayOld - (m_growth/2) > 0.6)
            return "rank7"

        if (m_perDayNew + m_perDayOld - (m_growth/2) > 0)
            return "rank8"

        return "rank9"
    }

    const submit = () => {
        const myRank = getRankFromQuestions(state)
        props.setRank({mainRank: myRank, subRank: "sub-rank2"})
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