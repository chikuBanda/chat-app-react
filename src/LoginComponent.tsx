import { LockOpen } from "@mui/icons-material"
import { TextField, Checkbox, FormControlLabel, Button } from "@mui/material"
import { Link } from "react-router-dom"
import { loginWithEmailPassword } from "./handlers/auth"
import { useState } from "react"
import SocialAuthComponent from "./SocialAuthComponent"

const LoginComponent = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const login = async () => {
        try {
            const user = await loginWithEmailPassword(email, password)
            console.log("Logged in user", user)
        } catch(error: any) {
            console.log("Error logging in user", error)
        }
    }

    return (
        <>
            <div className="grid grid-cols-12 h-screen">
                <div className="hidden md:block col-span-7 bg-[url('/img/car-3046424_1280.jpg')] h-full"></div>
                <div className="col-span-12 md:col-span-5 h-full pt-10 px-14">
                    <div className="flex justify-center">
                        <div className="rounded-full w-14 h-14 bg-cyan-600 flex justify-center items-center">
                            <LockOpen className="text-white text-3xl" />
                        </div>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault();login() }}>
                        <h3 className="text-center">Sign in</h3>

                        <div className="mt-4">
                            <TextField 
                                className="w-full"
                                id="login_email"
                                name="login_email" 
                                label="Email Address*"
                                type="email" 
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="mt-6">
                            <TextField 
                                className="w-full"
                                id="login_password" 
                                name="login_password"
                                label="Password*"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <div className="mt-4">
                            <FormControlLabel 
                                control={<Checkbox id="login_remember_me" />} 
                                label="Remember me ?" />
                        </div>

                        <div className="mt-4">
                            <Button
                                className="w-full" 
                                type="submit"
                                variant="contained"
                                >Sign in</Button>
                        </div>

                        <div className="mt-3 grid grid-cols-12">
                            <div className="col-span-4">
                                <Link to={'/'}>Forgot password?</Link>
                            </div>
                            <div className="col-span-4 col-start-9 text-right">
                                <Link to={'/auth/register'}>Create account?</Link>
                            </div>
                        </div>
                    </form>

                    <div className="mt-10">
                        <SocialAuthComponent />
                    </div>
                </div>
            </div>
        </>
    )
}

export default  LoginComponent