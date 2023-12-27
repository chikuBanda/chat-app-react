import { addDoc, collection, getDocs, getDoc, doc, query, where, orderBy, limit } from "firebase/firestore";
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

export const getUserByUid = async (uid: string) => {
    console.log('uid', uid)
    const q = query(ref, where("uid", "==", uid), orderBy('uid'), limit(1))

    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
        let user
        querySnapshot.forEach((doc) => {
            user = doc.data()
        })
        console.log("Document data:", user);
        return user
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return null
    }
}

// export const unsubusers = onSnapshot(ref, (snapshot) => {
//     let users: any[] = [];
//     snapshot.forEach((doc) => {
//         users.push(doc.data());
//     });
//     console.log("Current users: ", users);
// })