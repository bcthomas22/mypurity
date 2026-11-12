import { useEffect, useState } from 'react'
import { ApiClient, BibleClient } from '@youversion/platform-core'
import type { VersesReadData } from './Log';
import { changeRank } from './Ranks';

const VERSION_ID = 3034;

const apiClient = new ApiClient({
  appKey: import.meta.env.VITE_YOUVERSION_APP_KEY as string,
})

const bibleClient = new BibleClient(apiClient)

// Derived from the SDK itself, so these stay correct if its types change
type VotdData = Awaited<ReturnType<BibleClient['getVOTD']>>

// What the widget actually displays
interface DisplayPassage {
  reference: string
  content: string
}

function dayOfYear(): number {
  const now = new Date()
  const start = Date.UTC(now.getFullYear(), 0, 0)
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((today - start) / 86_400_000)
}

interface PassageTextProps {
  usfm: string
}

// Fetches and displays the text for a reference like "JHN.3.16"
function PassageText({ usfm }: PassageTextProps) {
  const [passage, setPassage] = useState<DisplayPassage | null>(null)

  useEffect(() => {
    let cancelled = false

    bibleClient
      .getPassage(VERSION_ID, usfm, 'text')
      .then((p) => {
        if (!cancelled) setPassage({ reference: p.reference, content: p.content })
      })
      .catch((err) => {
            console.error('getPassage failed:', { versionId: VERSION_ID, usfm }, err)
            if (!cancelled) setPassage({ reference: usfm, content: 'Could not load this verse.' })
      })

    return () => {
      cancelled = true
    }
  }, [usfm])

  if (!passage) return <p>Loading…</p>

  return (
    <div style={{ marginBottom: 12 }}>
      <strong>{passage.reference} BSB</strong>
      <p style={{ margin: '4px 0 0' }}>{passage.content}</p>
    </div>
  )
}

export default function VerseWidget() {
  const verseDataFromLocalSer = localStorage.getItem("verse-data");
  const verseDataFromLocal: VersesReadData = verseDataFromLocalSer === null ? null : JSON.parse(verseDataFromLocalSer);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (!verseDataFromLocal){
    const newVerseData: VersesReadData = {lastDateRead: new Date(yesterday), currentStreak: 0, total: 0}
    localStorage.setItem("verse-data", JSON.stringify(newVerseData))
  }

  console.log(verseDataFromLocal)

  const [votd, setVotd] = useState<VotdData | null>(null)
  const [total, setTotal] = useState<number>(verseDataFromLocal?.total ?? 0)
  const [streak, setStreak] = useState<number>(verseDataFromLocal?.currentStreak ?? 0)

  useEffect(() => {
    bibleClient.getVOTD(dayOfYear()).then(setVotd).catch(console.error)
    yesterday.setHours(0,0,0,0);
    setStreak(s => ((new Date(verseDataFromLocal?.lastDateRead)) < yesterday) ? 0 : s);
  }, [])

  const readInBible = () => {
      const trackedDate = new Date();

      if(trackedDate.toDateString() === new Date(verseDataFromLocal.lastDateRead).toDateString())
        return;

      trackedDate.setDate(trackedDate.getDate() - 1)
      const newStreak = (verseDataFromLocal.currentStreak === 0 || trackedDate.toDateString() === new Date(verseDataFromLocal.lastDateRead).toDateString()) ? verseDataFromLocal.currentStreak + 1 : 1
      const newVerseData: VersesReadData = {lastDateRead: new Date(), currentStreak: newStreak, total: verseDataFromLocal.total + 1}
      localStorage.setItem("verse-data", JSON.stringify(newVerseData))

      const rankChange = 15 + Math.min(15, newStreak) + Math.trunc(Math.min(30, verseDataFromLocal.total + 1) / 2);

      changeRank(rankChange);
      setTotal(t => t + 1);
      setStreak(newStreak);
  }

  return (
    <>
    <section
      style={{
        maxWidth: 480,
        margin: '24px auto',
        padding: 16,
        border: '1px solid #ddd',
        borderRadius: 12,
      }}
    >
      <h3>Verse of the Day</h3>
      {votd ? <PassageText usfm={votd.passage_id} /> : <p>Loading…</p>}

      <button className='log-button'>
        <a 
          className='read-in-bible' 
          href={"https://bible.com/bible/" + VERSION_ID + "/" + votd?.passage_id} 
          target="_blank"
          onClick={readInBible}>Read in Bible</a>
      </button>

      <h3>Daily Verses Read</h3>
      <p>Total: {total}</p>
      <p>Streak: {streak}</p>

    </section>
    </>
  )
}