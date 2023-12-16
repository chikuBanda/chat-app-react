import { Outlet } from "react-router-dom"
// import { requestPermission  } from './firebase/firebase'
import { useEffect } from "react"

const App = () => {
  useEffect(() => {
    // requestPermission()
  }, [])

  return (
    <>
      <Outlet />
    </>
  )
}

export default App