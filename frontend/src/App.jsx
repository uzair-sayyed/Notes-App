import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NoteDetailPage from "./pages/NoteDetailPage";
import SharedNotePage from "./pages/SharedNotePage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            {/* Public Routes */}
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/share/:token' element={<SharedNotePage />} />

            {/* Protected Routes */}
            <Route
              path='/dashboard'
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path='/notes/:id'
              element={
                <PrivateRoute>
                  <NoteDetailPage />
                </PrivateRoute>
              }
            />

            {/* Default Route */}
            <Route path='/' element={<Navigate to='/dashboard' />} />
            <Route path='*' element={<Navigate to='/dashboard' />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
