import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import LoginPage from "./Pages/LoginPage";
import RegistrationPage from "./Pages/RegistrationPage";
import ChatPage from "./Pages/ChatPage";
import { AuthProvider } from "./Context/AuthContext";
import { ToastContainer } from 'react-toastify';

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route  path="login" element={<LoginPage/>} />
        <Route path="register" element={<RegistrationPage/>} />
  


        {/* Protected section */}
        <Route element={<ProtectedRoute />}>
           <Route index element={<ChatPage/>} />
        </Route>

        
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Route>
    )
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      {/* <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        /> */}
    </AuthProvider>
  )
  }

export default App;
