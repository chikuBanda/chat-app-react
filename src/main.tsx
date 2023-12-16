import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css'

import App from './App.tsx'
import { TestFirebase } from './TestFirebase.tsx'
import AuthComponent from './AuthComponent.tsx';
import LoginComponent from './LoginComponent.tsx'
import SignUpComponent from './SignUpComponent.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
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
      }
    ]
  },
  {
    path: '/users',
    element: <TestFirebase />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={ router } />
  </React.StrictMode>,
)
