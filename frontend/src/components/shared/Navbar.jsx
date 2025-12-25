import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className='bg-white shadow-sm border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <button
              onClick={() => navigate("/dashboard")}
              className='text-xl font-bold text-indigo-600'
            >
              Notes App
            </button>
          </div>

          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600'>{user?.user?.email}</span>
              {user?.user?.role === "ADMIN" && (
                <span className='px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200'>
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className='px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50'
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
