import useChatStore from '../../stores/chat'
import ConversationItemComponent from './ConversationItemComponent'

const ConversationListComponent = () => {
    const conversations = useChatStore((state) => state.conversations)
    
    const renderConversations = () => {
        let elements = []

        for (let i = 0; i < conversations.length; i++) {
            console.log('conversations[i]: ', conversations[i])
            elements.push((<ConversationItemComponent key={i} conversation={conversations[i]} />))
        }

        return elements
    }

    return (
        <>
            { renderConversations() }
        </>
    )
}

export default ConversationListComponent