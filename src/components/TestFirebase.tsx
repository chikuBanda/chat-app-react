import { useEffect, useState } from "react"
import { addUser, getUsers } from '../utils/handlers/user'
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase/firebase"
import useMessageStore from "../stores/messages"
import AddMessageComponent from "./AddMessageComponent"

export const TestFirebase = () => {
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [occupation, setOccupation] = useState('')
    const [users, setUsers] = useState<any[]>([])

    const ref = collection(db, "users")
    const messages = useMessageStore((state) => state.messages)

    const fetchUsers = async () => {
        let return_users = await getUsers()
        console.log("returned users", return_users)
        setUsers(return_users)
    }

    useEffect(() => {
        fetchUsers()
            .then(() => {
                console.log('Fetched users in useEffect')
            })

        onSnapshot(ref, (snapshot) => {
            let user_updates: any[] = [];
            snapshot.forEach((doc) => {
                user_updates.push(doc.data());
            });
            setUsers(user_updates)
            console.log("Current users: ", user_updates);
        })
    }, [])

    const onAddUser = async () => {
        await addUser({
            first_name,
            last_name,
            occupation
        })

        await fetchUsers()
    }

    const displayUsers = () => {
        return users.map((user: any, index) => {
            let str = 'first_name: ' + user.first_name + ' | ' + 'last_name: ' + user.last_name + ' | ' + 'occupation: ' + user.occupation
            return <p key={ 'user' + index }>{ str }</p>
        })
    }

    const displayMessages = () => {
        return messages.map((msg: string, index) => {
            return <p key={ 'key' + index } className={ 'mt-10' + (index % 2 == 0) ? ' text-cyan-700' : 'text-blue-900' }>
                { msg }
            </p>
        })
    }

    return (
        <>
            <div className="mb-5">
                { displayUsers() }
                { displayMessages() }
            </div>
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

            <AddMessageComponent />
        </>
    )
}