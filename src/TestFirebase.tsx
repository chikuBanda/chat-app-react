import { useState } from "react"
import { addUser, getUsers } from './handlers/user'

export const TestFirebase = () => {
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [occupation, setOccupation] = useState('')

    const fetchUsers = async () => {
        let users = await getUsers()
        console.log("returned users", users)
    }

    const onAddUser = async () => {
        await addUser({
            first_name,
            last_name,
            occupation
        })

        await fetchUsers()
    }

    return (
        <>
            <div style={{ marginTop: 100 }}>
                <label htmlFor="first_name">First name </label>
                <input 
                    type="text" 
                    id="first_name"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)} />
            </div>

            <div style={{ marginTop: 30 }}>
                <label htmlFor="last_name">Last name </label>
                <input 
                    type="text" 
                    id="last_name"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)} />
            </div>

            <div style={{ marginTop: 30 }}>
                <label htmlFor="occupation">Occupation </label>
                <input 
                    type="text" 
                    value={occupation} 
                    onChange={(e) => setOccupation(e.target.value)} />
            </div>

            <div style={{ marginTop: 30 }}>
                <button onClick={onAddUser}>Add user</button>
            </div>

            <div style={{ marginTop: 30 }}>
                <button onClick={fetchUsers}>Fetch users</button>
            </div>
        </>
    )
}