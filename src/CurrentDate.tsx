import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useEffect, useState } from 'react'

//this doesnt work, If I choose to use an actual API method for getting d/t I will switch bach to this later
export const fetchServerDateEST = async () => {
    const response = await fetch("https://timeapi.io"); // faulty api, see comment above;
    const data = await response.json();
    const date = toZonedTime(data.datetime, 'America/New_York');
    return date;
};
//this doesnt work, If I choose to use an actual API method for getting d/t I will switch bach to this later
export const fetchServerDateFormatted = async () => {
    const date = await fetchServerDateEST()
    const displayString = format(date, 'MMMM dd, yyyy'); // Output: "July 08, 2026"
    return displayString;
};

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

export function CurrentDate() {

    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentDate(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <h1>{currentDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
                })}
            </h1>
            <h3>{currentDate.toLocaleString("en-US").split(',')[1]}</h3>
        </>
    )
}

export function YesterdaysDate() {

    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1)

    return (
        <>
            <h1>{yesterday.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
                })}
            </h1>
        </>
    )
}
