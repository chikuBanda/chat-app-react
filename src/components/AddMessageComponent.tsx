import { useState } from "react"
import useMessageStore from "../stores/messages"

const AddMessageComponent = () => {
    const [message, setMessage] = useState('') 
    const addMessage = useMessageStore((state) => state.addMessage)

    const submitMessage = () => {
        addMessage(message)
    }
    return (
        <>
            <div style={{ marginTop: 100 }}>
                <label htmlFor="message">Message </label>
                <input 
                    type="text" 
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)} />
            </div>

            <div style={{ marginTop: 30 }}>
                <button onClick={ submitMessage }>Add message</button>
            </div>
        </>
    )
}

export default AddMessageComponent