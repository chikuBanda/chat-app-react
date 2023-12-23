import { Facebook, GitHub, Google } from "@mui/icons-material"
import { Button } from "@mui/material"
import { signInWithGoogle } from "../../utils/handlers/auth"
import { requestPermission  } from '../../firebase/firebase'
import useAuthStore from "../../stores/auth"
import { useNavigate } from "react-router-dom"

const SocialAuthComponent = () => {
    const setLoggedInState = useAuthStore((state) => state.setLoggedInState)
    const navigate = useNavigate()
    const signUpGoogle = async () => {
        try {
            const user = await signInWithGoogle()
            console.log("signed up with google", user)
            setLoggedInState(true)
            navigate('/')
            requestPermission()
        } catch (error: any) {
            console.log("error registering user with google", error)
        }
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