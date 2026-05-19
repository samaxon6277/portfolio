import { Bell, Search, Menu, UserCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../lib/AuthContext";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import { supabase } from "../../lib/supabase";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch unread count for bell icon
  useEffect(() => {
    let mounted = true;
    const fetchUnreadCount = async () => {
      try {
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('read', false);
        
        if (error) throw error;
        if (mounted && count !== null) {
          setUnreadCount(count);
        }
      } catch (e) {
        console.error("Error fetching unread notifications count:", e);
      }
    };
    fetchUnreadCount();

    // Subscribe to new notifications
    const sub = supabase.channel('public:notifications_count')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(sub);
    };
  }, []);

  return (
    <header className="h-20 bg-[#1B1B1B] border-b border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-30">
      <div className="flex items-center">
        <button className="md:hidden p-2 mr-2 text-[#A8AFBD] hover:text-white" onClick={onMenuClick}>
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="relative hidden md:block">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8AFBD]" />
          <input 
            type="text" 
            placeholder="Search projects, blogs, etc..." 
            className="bg-[#101010] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-[#A8AFBD] focus:outline-none focus:border-[#2984FF] transition-colors w-64 lg:w-96"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6" ref={navRef}>
        <div className="relative">
          <button 
            className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-white/10 text-white' : 'text-[#A8AFBD] hover:text-white hover:bg-white/5'}`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
          >
            <Bell className={`w-5 h-5 ${unreadCount > 0 ? "animate-pulse" : ""}`} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FE774E] rounded-full ring-2 ring-[#1B1B1B]"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 z-50"
              >
                <NotificationDropdown onClose={() => setShowNotifications(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="relative">
          <div 
            className="flex items-center space-x-3 cursor-pointer p-1 rounded-full hover:bg-white/5 pr-3 transition-colors"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
          >
            <div className="hidden md:block text-right">
              <div className="text-sm font-semibold text-white">{user?.user_metadata?.full_name || "Admin"}</div>
              <div className="text-xs text-[#A8AFBD]">Super Admin</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2984FF] to-[#FE774E] p-[2px]">
              <div className="w-full h-full bg-[#1B1B1B] rounded-full border border-[#1B1B1B] overflow-hidden flex items-center justify-center">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt={user?.user_metadata?.full_name || "Admin"} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-6 h-6 text-[#A8AFBD]" />
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 z-50"
              >
                <ProfileDropdown onClose={() => setShowProfile(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
