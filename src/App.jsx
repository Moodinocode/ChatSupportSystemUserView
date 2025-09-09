import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import LoginPage from "./Pages/LoginPage";
import RegistrationPage from "./Pages/RegistrationPage";
import ChatPage from "./Pages/ChatPage";
import { AuthProvider } from "./Context/AuthContext";
function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route  path="login" element={<LoginPage/>} />
        <Route path="register" element={<RegistrationPage/>} />
        <Route index element={<ChatPage/>} />


        {/* Protected section */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<div>Dashboard (Private)</div>} />
          <Route path="profile" element={<div>Profile (Private)</div>} />
        </Route>

        
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Route>
    )
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
  }

export default App;
