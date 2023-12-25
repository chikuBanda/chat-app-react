import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from 'react-router-dom'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css'

import App from './components/App.tsx'
import { TestFirebase } from './components/TestFirebase.tsx'
import AuthComponent from './components/auth/AuthComponent.tsx';
import LoginComponent from './components/auth/LoginComponent.tsx'
import SignUpComponent from './components/auth/SignUpComponent.tsx';
import ChatComponent from './components/chat/ChatComponent.tsx';
import ProtectedRoute from './components/shared/ProtectedRoute.tsx';
import HomeComponent from './components/HomeComponent.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Navigate to={'/app'} />
      },
      {
        path: "auth",
        element: <AuthComponent />,
        children: [
          {
            path: "login",
            element: <LoginComponent />
          },
          {
            path: "register",
            element: <SignUpComponent />
          }
        ]
      },
      {
        path: 'app',
        element: <ProtectedRoute><HomeComponent /></ProtectedRoute>,
        children: [
          {
            path: '',
            element: <TestFirebase />
          },
          {
            path: 'chat',
            element: <ChatComponent />
          }
        ]
      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={ router } />
  </React.StrictMode>,
)
