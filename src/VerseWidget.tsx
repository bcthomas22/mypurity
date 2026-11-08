import { useEffect, useState } from 'react'
import { ApiClient, BibleClient, YouVersionPlatformConfiguration  } from '@youversion/platform-core'
import { useYVAuth, useHighlights } from '@youversion/platform-react-hooks'

const VERSION_ID = 3034;

const apiClient = new ApiClient({
  appKey: import.meta.env.VITE_YOUVERSION_APP_KEY as string,
})

const bibleClient = new BibleClient(apiClient)

// Derived from the SDK itself, so these stay correct if its types change
type VotdData = Awaited<ReturnType<BibleClient['getVOTD']>>

// Local shape for a highlight. Field names are inferred, so verify with the console log
interface HighlightItem {
  passage_id: string
  color?: string
}

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

// Accepts either { data: [...] } or a plain array, and ignores anything malformed
function toHighlightList(highlights: unknown): HighlightItem[] {
  const raw: unknown = Array.isArray(highlights)
    ? highlights
    : (highlights as { data?: unknown } | null | undefined)?.data

  if (!Array.isArray(raw)) return []

  return raw.filter(
    (h): h is HighlightItem =>
      typeof h === 'object' &&
      h !== null &&
      typeof (h as HighlightItem).passage_id === 'string'
  )
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
      <strong>{passage.reference}</strong>
      <p style={{ margin: '4px 0 0' }}>{passage.content}</p>
    </div>
  )
}

export default function VerseWidget() {
  const [votd, setVotd] = useState<VotdData | null>(null)

  useEffect(() => {
    bibleClient.getVOTD(dayOfYear()).then(setVotd).catch(console.error)
  }, [])

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

    </section>
    </>
  )
}