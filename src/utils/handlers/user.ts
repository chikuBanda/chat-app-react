import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase/firebase'
import { User } from "../../models/interfaces/user";

const ref = collection(db, "users")

export const addUser = async (user: User) => {
    try {
        const docRef = await addDoc(ref, user)

        console.log('Document written with ID: ', docRef.id)
    } catch (e) {
        console.error('Error adding document: ', e)
    }
}

export const getUsers = async () => {
    const querySnapshot = await getDocs(ref)
    console.log(querySnapshot)
    let users: any[] = []
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        users.push(doc.data())
    })

    return users
}

// export const unsubusers = onSnapshot(ref, (snapshot) => {
//     let users: any[] = [];
//     snapshot.forEach((doc) => {
//         users.push(doc.data());
//     });
//     console.log("Current users: ", users);
// })