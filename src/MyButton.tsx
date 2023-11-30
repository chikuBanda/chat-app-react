interface props {
    count: number, 
    onClick: any
}

const MyButton = ({count, onClick}: props) => {
    return (
        <>
            <button onClick={onClick}>click count ({count})</button>
        </>
    )
}

export default MyButton