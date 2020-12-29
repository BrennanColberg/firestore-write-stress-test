import { time } from "console"
import firestoreClient from "firebase/firestoreClient"
import { useEffect, useState } from "react"

type Text = {
  _id: string
  _created: string // ISO 8601
  _updated: string // ISO 8601
  content: string
}

const timeInISO8601 = () => new Date().toISOString()

// returns the ID of the created text
function createText(): string {
  const reference = firestoreClient.collection("texts").doc()

  reference.set({
    _id: reference.id,
    _created: timeInISO8601(),
    _updated: timeInISO8601(),
    content: "",
  })

  return reference.id
}

// returns a cleanup function which kills the listener
function readAllTexts(setTexts: (texts: Text[]) => void): () => void {
  return firestoreClient
    .collection("texts")
    .orderBy("_created", "desc")
    .limit(10)
    .onSnapshot((snap) => {
      const texts = snap.docs.map((doc) => doc.data())
      setTexts(texts as Text[])
    })
}

function updateText(id: string, text: string) {
  if (id === null) return
  firestoreClient.collection("texts").doc(id).update({ content: text })
}

export default function SplashPage(): JSX.Element {
  // this session should have a single "id" (for updating its text)
  const [id, setId] = useState<string>(null)
  useEffect(() => console.log("id", id), [id])
  useEffect(() => {
    // get the ID of a brand-new "text" when the page loads
    setId(createText())
  }, [])

  // constantly watch the "texts" collection and get all updates
  // (this renders whatever other users are typing)
  const [texts, setTexts] = useState<Text[]>([])
  useEffect(() => {
    return readAllTexts(setTexts)
  }, [])

  // whenever this user's text changes, push that change to the database
  // (so that other users can see it)
  const [text, setText] = useState<string>("")
  useEffect(() => {
    updateText(id, text)
  }, [id, text])

  return (
    <div className="w-screen h-screen bg-red-400 flex flex-col justify-center items-center">
      <ul>
        {texts
          // don't show the text from this page
          .filter(({ _id }) => _id !== id)
          // don't show whitespace-only text
          .filter(({ content }) => content.trim().length > 0)
          // displays in descending order, with the oldest at the top
          .sort((a, b) => a._created.localeCompare(b._created))
          .map(({ _id, content }) => (
            <li
              key={_id}
              className="w-64 px-2 py-1 bg-red-100 rounded-md shadow-md mb-2"
            >
              {content}
            </li>
          ))}
      </ul>

      <input
        type="text"
        className="w-72 h-10 px-2 text-lg block rounded-md shadow-lg"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />
    </div>
  )
}
