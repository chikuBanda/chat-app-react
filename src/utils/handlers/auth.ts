import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
 } from 'firebase/auth'
import { auth } from '../../firebase/firebase'

const loginWithEmailPassword = async (email: string, password: string) => {
    console.log('email', email)
    console.log('password', password)

    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
            const user = userCredentials.user
            return Promise.resolve(user)
        })
        .catch((error: any) => {
            return Promise.reject(error)
        })
}

const signUpWithEmailPassword = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
            const user = userCredentials.user
            return Promise.resolve(user)
        })
        .catch((error: any) => {
            return Promise.reject(error)
        })
}

const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential?.accessToken

            console.log('token', token)

            // The signed-in user info
            const user = result.user
        
            console.log('signed in user', user)
            return Promise.resolve(user)
        })
        .catch((error) => {
            // const errorCode = error.code
            // const errorMessage = error.message

            // const email = error.customData.email
            // The AuthCredential type that was used.
            // const credential = GoogleAuthProvider.credentialFromError(error);

            return error
        })
}

export {
    loginWithEmailPassword,
    signUpWithEmailPassword,
    signInWithGoogle
}