import { Person } from "@mui/icons-material"
import { TextField, Button } from "@mui/material"
import { useState } from "react"
import { Link } from "react-router-dom"
import { signUpWithEmailPassword } from "../../utils/handlers/auth"
import SocialAuthComponent from "./SocialAuthComponent"

const SignUpComponent = () => {
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm_password, setConfirmPassword] = useState('')

    const signUp = async () => {
        signUpWithEmailPassword(email, password)
            .then((user) => {
                console.log("registered user", user)
            })
            .catch((error: any) => {
                console.log("error registering user", error)
            })
    }

    return (
        <>
            <div className="grid grid-cols-12 h-screen">
                <div className="hidden md:block col-span-7 bg-[url('/img/car-3046424_1280.jpg')] h-full"></div>
                <div className="col-span-12 md:col-span-5 h-full pt-10 px-14">
                    <div className="flex justify-center">
                        <div className="rounded-full w-14 h-14 bg-cyan-600 flex justify-center items-center">
                            <Person className="text-white text-3xl" />
                        </div>
                    </div>

                    <form onSubmit={(e) => {e.preventDefault();signUp()}}>
                        <h3 className="text-center">Sign up</h3>

                        <div className="mt-4 grid grid-cols-12">
                            <TextField 
                                className="col-span-6 mr-2"
                                id="sign_up_first_name"
                                name="first_name" 
                                label="First name*"
                                type="text" 
                                variant="outlined"
                                value={first_name}
                                onChange={(e) => setFirstName(e.target.value)} />

                            <TextField 
                                className="col-span-6"
                                id="sign_up_last_name"
                                name="last_name" 
                                label="Last name*"
                                type="text" 
                                variant="outlined"
                                value={last_name}
                                onChange={(e) => setLastName(e.target.value)} />
                        </div>

                        <div className="mt-4">
                            <TextField 
                                className="w-full"
                                id="sign_up_email"
                                name="email" 
                                label="Email Address*"
                                type="email" 
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="mt-6 grid grid-cols-12">
                            <TextField 
                                className="col-span-6 mr-2"
                                id="sign_up_password" 
                                name="password"
                                label="Password*"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                            
                            <TextField 
                                className="col-span-6"
                                id="sign_up_confirm_password" 
                                name="confirm_password"
                                label="Confirm Password*"
                                type="password"
                                variant="outlined"
                                value={confirm_password}
                                onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>

                        <div className="mt-4">
                            <Button
                                className="w-full" 
                                type="submit"
                                variant="contained">Sign up</Button>
                        </div>
                    </form>

                    <div className="mt-3 grid grid-cols-12">
                        {/* <div className="col-span-4">
                            <Link href="#">Forgot password?</Link>
                        </div> */}
                        <div className="col-span-7 col-start-6 text-right">
                            <Link to={'/auth/login'}>Already have an account? Sign in!</Link>
                        </div>
                    </div>

                    <div className="mt-10">
                        <SocialAuthComponent />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUpComponent