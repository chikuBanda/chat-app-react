import { Navigate, Outlet } from "react-router-dom"
import useAuthStore from "../../stores/auth"


const AuthComponent = () => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    
    if (isLoggedIn) {
        return <Navigate to="/" replace={true} />
    }
    return <Outlet />
}

export default AuthComponent