import { Facebook, GitHub, Google } from "@mui/icons-material"
import { Button } from "@mui/material"
import { signInWithGoogle } from "../../utils/handlers/auth"
import { requestPermission  } from '../../firebase/firebase'
import useAuthStore from "../../stores/auth"
import { useNavigate } from "react-router-dom"
import { User as FirebaseUser } from "firebase/auth"
import { User } from "../../models/interfaces/user"
import { addUser, getUserByUid } from "../../utils/handlers/user"

const SocialAuthComponent = () => {
    const setLoggedInState = useAuthStore((state) => state.setLoggedInState)
    const navigate = useNavigate()
    const signUpGoogle = async () => {
        try {
            const user: FirebaseUser = await signInWithGoogle()
            console.log("signed up with google", user)
            console.log("user", user)
            setLoggedInState(true)
            const userData: User = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
            }

            requestPermission()

            const userWithUidExists = await checkIfUserExists(user.uid)
            if (userWithUidExists) {
                console.log("user already exists")
                navigate('/')
                return
            } else {
                await addUser(userData) // add user to firestore
                console.log("added user to firestore")
                navigate('/')
            }
        } catch (error: any) {
            console.log("error registering user with google", error)
        }
    }

    const checkIfUserExists = async (uid: string) => {
        const user = await getUserByUid(uid)
        console.log('checking if user exists', user)
        return user !== null
    }

    return (
        <>
            <div className="text-center">
                <div className="mt-4">
                    <Button
                        startIcon={<Google />}
                        className="w-1/2 bg-red-500 text-white"
                        type="button"
                        onClick={signUpGoogle}
                        variant="contained">Google</Button>
                </div>

                <div className="mt-4">
                    <Button
                        startIcon={<GitHub />}
                        className="w-1/2 bg-slate-600 text-white"
                        type="button"
                        variant="contained">Github</Button>
                </div>

                <div className="mt-4">
                    <Button
                        startIcon={<Facebook />}
                        className="w-1/2 bg-sky-600 text-white"
                        type="button"
                        variant="contained">Facebook</Button>
                </div>

                <div className="mt-4">
                    <Button
                        type="button"
                        onClick={requestPermission}
                        variant="contained">Receive notifications</Button>
                </div>
            </div>
        </>
    )
}

export default SocialAuthComponent