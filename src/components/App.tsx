import { Outlet, useNavigate } from "react-router-dom"
import { onMessageListener, auth } from '../firebase/firebase'
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import useAuthStore from "../stores/auth";

const App = () => {
  const navigate = useNavigate()
  const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser)

  console.log('in app')
  
  onMessageListener().then(payload => {
    console.log(payload);
  }).catch(err => console.log('failed: ', err));

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log('user', user)
        navigate('/auth/login')
      }

      console.log('user', user)
      
      setAuthenticatedUser(user)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
        <Outlet />
    </>
  )
}

export default App