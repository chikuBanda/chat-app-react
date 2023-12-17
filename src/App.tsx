import { Outlet, Link } from "react-router-dom"
// import { requestPermission  } from './firebase/firebase'
import { useEffect } from "react"

const App = () => {
  useEffect(() => {
    // requestPermission()
  }, [])

  return (
    <>
      <Link className="mr-2" to={ '/auth' } >Home</Link>
      <Link className="mr-2" to={ '/auth/login' } >Login</Link>
      <Link to={ '/auth/register' } >Register</Link>
      <Outlet />
    </>
  )
}

export default App