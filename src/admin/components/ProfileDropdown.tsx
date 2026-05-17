import { UserCircle, Settings, Shield, Moon, AlignLeft, LogOut, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";

export default function ProfileDropdown({ onClose }: { onClose: () => void }) {
  const { user, logOut } = useAuth();

  return (
    <div className="absolute right-0 mt-2 w-64 bg-[#1B1B1B] border border-white/10 rounded-2xl shadow-xl overflow-hidden py-2 flex flex-col z-50">
      
      {/* Header Profile Info */}
      <div className="px-4 py-3 border-b border-white/5 mb-2 hover:bg-white/5 transition-colors cursor-pointer block">
        <Link to="/dashboard/profile" onClick={onClose} className="flex items-center gap-3 w-full">
           <div className="w-10 h-10 rounded-full overflow-hidden bg-[#101010] border border-white/10 shrink-0 flex items-center justify-center">
             {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
                <UserCircle className="w-6 h-6 text-[#A8AFBD]" />
             )}
           </div>
           <div className="flex-1 min-w-0">
             <div className="text-sm font-semibold text-white truncate">{user?.displayName || "Admin User"}</div>
             <div className="text-xs text-[#A8AFBD] truncate">{user?.email}</div>
           </div>
        </Link>
      </div>

      <div className="px-2 space-y-1">
        <Link to="/dashboard/profile" onClick={onClose} className="w-full text-left px-3 py-2 text-sm text-[#A8AFBD] hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-3 transition-colors">
          <UserCircle className="w-4 h-4" /> Edit Profile
        </Link>
        <Link to="/dashboard/profile?tab=settings" onClick={onClose} className="w-full text-left px-3 py-2 text-sm text-[#A8AFBD] hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-3 transition-colors">
          <Settings className="w-4 h-4" /> Account Settings
        </Link>
        <Link to="/dashboard/profile?tab=notifications" onClick={onClose} className="w-full text-left px-3 py-2 text-sm text-[#A8AFBD] hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-3 transition-colors">
          <Bell className="w-4 h-4" /> Notification Settings
        </Link>
      </div>
      
      <div className="px-2 my-2 border-t border-white/5 pt-2 space-y-1">
        <Link to="/dashboard/profile?tab=appearance" onClick={onClose} className="w-full text-left px-3 py-2 text-sm text-[#A8AFBD] hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-3 transition-colors">
          <Moon className="w-4 h-4" /> Appearance
        </Link>
        <Link to="/dashboard/profile?tab=security" onClick={onClose} className="w-full text-left px-3 py-2 text-sm text-[#A8AFBD] hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-3 transition-colors">
          <Shield className="w-4 h-4" /> Security
        </Link>
        <Link to="/dashboard/profile?tab=activity" onClick={onClose} className="w-full text-left px-3 py-2 text-sm text-[#A8AFBD] hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-3 transition-colors">
          <AlignLeft className="w-4 h-4" /> Activity Logs
        </Link>
      </div>

      <div className="px-2 mt-2 border-t border-white/5 pt-2">
        <button onClick={() => { onClose(); logOut(); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-xl flex items-center gap-3 transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );
}
