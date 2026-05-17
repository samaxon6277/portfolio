import { Users, Eye, FileText, CheckCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Link } from "react-router-dom";
import CustomSelect from "../components/CustomSelect";

export default function AdminDashboard() {
  const [activeProjects, setActiveProjects] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [blogViews, setBlogViews] = useState(0);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [filter, setFilter] = useState("This Week");
  const [trafficData, setTrafficData] = useState<any[]>([]);

  useEffect(() => {
    // Real-time messages
    const msgsQuery = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(4));
    const unsubMsgs = onSnapshot(msgsQuery, (snapshot) => {
      const leads = snapshot.docs.map(doc => {
        const d = doc.data();
        let timeStr = "recently";
        if (d.createdAt) {
           const date = d.createdAt.toDate();
           timeStr = date.toLocaleDateString();
        }
        return {
          id: doc.id,
          name: d.name,
          project: d.subject || "No Subject",
          time: timeStr,
          status: d.status || "New"
        };
      });
      setRecentLeads(leads);
    });

    // Real-time projects count
    const unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
      const activeProjs = snapshot.docs.filter(d => d.data().status === "Published").length;
      setActiveProjects(activeProjs);
    });

    // Real-time messages count
    const unsubAllMsgs = onSnapshot(collection(db, "messages"), (snapshot) => {
      setTotalMessages(snapshot.size);
    });

    // Real-time blogs for total views
    const unsubBlogs = onSnapshot(collection(db, "blogs"), (snapshot) => {
      let views = 0;
      snapshot.docs.forEach(doc => {
         views += (doc.data().views || 0);
      });
      setBlogViews(views);
    });

    // Mock logs for visitors if no real logs. (Waiting for frontend tracker)
    const unsubLogs = onSnapshot(collection(db, "visitor_logs"), (snapshot) => {
      const logs = snapshot.docs.map(doc => doc.data());
      setTotalVisitors(logs.length);
      
      // Generate chart data based on logs
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      let counts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
      
      logs.forEach(log => {
         if (log.createdAt) {
            const date = log.createdAt.toDate();
            // Just basic demo implementation for traffic logic
            const currentWeek = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);
            if (date.getTime() > currentWeek) {
               counts[days[date.getDay()] as keyof typeof counts]++;
            }
         }
      });
      
      const newTrafficData = days.map(d => ({ name: d, visitors: counts[d as keyof typeof counts] }));
      setTrafficData(newTrafficData);
    });

    return () => {
      unsubMsgs();
      unsubProjects();
      unsubAllMsgs();
      unsubBlogs();
      unsubLogs();
    };
  }, []);

  const stats = [
    { label: "Total Visitors", value: totalVisitors, icon: Users, color: "text-[#2984FF]", bg: "bg-[#2984FF]/10", change: "Real" },
    { label: "Blog Views", value: blogViews, icon: Eye, color: "text-[#FE774E]", bg: "bg-[#FE774E]/10", change: "Real" },
    { label: "Total Leads", value: totalMessages.toString(), icon: FileText, color: "text-green-400", bg: "bg-green-400/10", change: "Real" },
    { label: "Active Projects", value: activeProjects.toString(), icon: CheckCircle, color: "text-purple-400", bg: "bg-purple-400/10", change: "Real" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold">Dashboard Overview</h1>
        <p className="text-[#A8AFBD] mt-1">Welcome back. Here's what's happening with your portfolio today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#1B1B1B] border border-white/5 p-6 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-400' : 'text-[#A8AFBD]'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <div className="text-3xl font-bold font-display">{stat.value}</div>
              <div className="text-[#A8AFBD] text-sm mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-[#1B1B1B] border border-white/5 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold font-display">Traffic Overview</h2>
              <p className="text-[#A8AFBD] text-sm mt-1">Weekly visitor statistics (Mocked)</p>
            </div>
            <CustomSelect 
              value={filter}
              onChange={setFilter}
              options={["This Week", "Last Week"]}
              className="w-36"
            />
          </div>
          <div className="h-72 w-full min-h-[300px] [&_*:focus]:outline-none [&_*:focus-visible]:outline-none">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2984FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2984FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#A8AFBD" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#A8AFBD" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#101010', borderColor: '#ffffff10', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ stroke: '#ffffff10', strokeWidth: 1, fill: 'transparent' }}
                />
                <Area type="monotone" dataKey="visitors" stroke="#2984FF" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" activeDot={{ r: 6, strokeWidth: 0, stroke: 'none' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-[#1B1B1B] border border-white/5 p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-display">Recent Leads</h2>
            <Link to="/dashboard/messages" className="text-[#2984FF] text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="flex-1 space-y-4">
            {recentLeads.length === 0 ? (
               <div className="text-center text-[#A8AFBD] py-8">No leads yet.</div>
            ) : (
                recentLeads.map((lead, i) => (
                  <Link to="/dashboard/messages" key={i} className="flex items-start space-x-4 p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-[#101010] flex items-center justify-center font-bold text-[#A8AFBD] group-hover:text-white group-hover:bg-[#2984FF] transition-colors shrink-0">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold truncate text-white">{lead.name}</p>
                        <span className="text-xs text-[#A8AFBD]">{lead.time}</span>
                      </div>
                      <p className="text-sm text-[#A8AFBD] truncate">{lead.project}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        lead.status === 'New' ? 'bg-[#2984FF]/20 text-[#2984FF]' :
                        lead.status === 'Contacted' ? 'bg-[#FE774E]/20 text-[#FE774E]' :
                        'bg-green-400/20 text-green-400'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </Link>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
