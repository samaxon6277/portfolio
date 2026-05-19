import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, ExternalLink } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

export default function NotificationDropdown({ onClose }: { onClose?: () => void }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (mounted && data) {
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.read).length);
        }
      } catch (error) {
        console.error("Notifications error", error);
      }
    };
    fetchNotifications();

    const sub = supabase.channel('public:notifications_list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(sub);
    };
  }, []);

  const markAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      if (unreadIds.length > 0) {
        await supabase.from('notifications').update({ read: true }).in('id', unreadIds);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await supabase.from('notifications').delete().eq('id', id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[#1B1B1B] border border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#1B1B1B]">
        <h3 className="font-semibold text-white font-display">Notifications</h3>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-xs text-[#2984FF] hover:underline flex items-center gap-1">
            <Check className="w-3 h-3" /> Mark all read
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <Bell className="w-10 h-10 text-white/10 mb-3" />
            <p className="text-sm text-[#A8AFBD]">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-4 hover:bg-white/5 transition-colors group relative ${!notif.read ? 'bg-[#2984FF]/5' : ''}`}>
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    notif.type === 'inquiry' ? 'bg-[#2984FF]/20 text-[#2984FF]' :
                    notif.type === 'security' ? 'bg-red-400/20 text-red-400' :
                    notif.type === 'activity' ? 'bg-purple-400/20 text-purple-400' :
                    'bg-green-400/20 text-green-400'
                  }`}>
                     <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <p className={`text-sm ${!notif.read ? 'text-white font-medium' : 'text-[#A8AFBD]'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-[#A8AFBD] mt-1 line-clamp-2">{notif.message}</p>
                    
                    <div className="flex items-center gap-3 mt-2">
                       {notif.created_at && (
                         <span className="text-[10px] text-[#A8AFBD]/70 uppercase tracking-wider">
                           {new Date(notif.created_at).toLocaleString()}
                         </span>
                       )}
                       {notif.link && (
                         <Link to={notif.link} onClick={onClose} className="text-[10px] text-[#2984FF] flex items-center gap-1 hover:underline">
                           View <ExternalLink className="w-3 h-3" />
                         </Link>
                       )}
                    </div>
                  </div>
                </div>

                {/* Actions that appear on hover */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   {!notif.read && (
                     <button onClick={(e) => markAsRead(notif.id, e)} className="p-1.5 bg-[#101010] border border-white/10 rounded-md text-[#A8AFBD] hover:text-white transition-colors" title="Mark as read">
                       <Check className="w-3 h-3" />
                     </button>
                   )}
                   <button onClick={(e) => deleteNotification(notif.id, e)} className="p-1.5 bg-[#101010] border border-white/10 rounded-md text-[#A8AFBD] hover:text-red-400 transition-colors" title="Delete">
                     <Trash2 className="w-3 h-3" />
                   </button>
                </div>
                {!notif.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#2984FF] group-hover:hidden"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-white/5 bg-[#101010] text-center">
        <Link to="/dashboard/notifications" onClick={onClose} className="text-sm font-medium text-[#A8AFBD] hover:text-white transition-colors">
          View all notifications
        </Link>
      </div>
    </div>
  );
}
