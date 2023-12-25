import ConversationItemComponent from './ConversationItemComponent'

const ConversationListComponent = () => {
    const renderConversations = () => {
        let elements = []

        for (let i = 0; i <= 6; i++) {
            elements.push(<ConversationItemComponent />)
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