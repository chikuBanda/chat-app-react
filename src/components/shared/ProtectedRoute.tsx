import { Navigate } from "react-router-dom"
import useAuthStore from "../../stores/auth"

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    
    if (!isLoggedIn) {
        return <Navigate to="/auth/login" replace={true} />
    }
    return children
}

export default ProtectedRoute