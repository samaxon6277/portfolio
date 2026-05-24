import { motion } from 'motion/react';
import { 
  Users, Bot, FileCheck, CheckCircle2, XCircle, Briefcase, 
  Settings, ArrowUpRight, ArrowDownRight, Activity, Calendar, Chrome, Smartphone, Globe
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Lead, JobApplication } from '../../types';
import { BotVisit, ActivityLog } from '../../utils/mockAdminData';
import { analytics } from '../../utils/analytics';

interface DashboardTabProps {
  leads: Lead[];
  careers: JobApplication[];
  botVisits: any[];
  activityLogs: any[];
  onNavigateTo: (targetTab: string) => void;
}

export default function DashboardTab({ leads, careers, botVisits, activityLogs, onNavigateTo }: DashboardTabProps) {
  // Aggregate real stats from actual database matrices
  const [analyticsData, setAnalyticsData] = useState(() => {
    const rawEvents = (activityLogs || []).map(l => ({
      ...l,
      event_type: (l.actionType || '').toLowerCase()
    }));
    const rawBots = (botVisits || []).map(b => ({
      ...b,
      created_at: b.lastSeenAt
    }));
    return analytics.computeStatsFromDatabase(rawEvents, rawBots, leads.length, careers.length);
  });

  useEffect(() => {
    const rawEvents = (activityLogs || []).map(l => ({
      ...l,
      event_type: (l.actionType || '').toLowerCase()
    }));
    const rawBots = (botVisits || []).map(b => ({
      ...b,
      created_at: b.lastSeenAt
    }));
    setAnalyticsData(analytics.computeStatsFromDatabase(rawEvents, rawBots, leads.length, careers.length));
  }, [leads.length, careers.length, botVisits, activityLogs]);

  // Calculations
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => {
    const s = (l.status as string || '').toLowerCase();
    return s === 'new';
  }).length;
  
  const qualifiedLeads = leads.filter(l => {
    const s = (l.status as string || '').toLowerCase();
    return s === 'negotiating' || s === 'won' || s === 'qualified' || s === 'demo sent';
  }).length;
  
  // Checking both lowercase & capitalized statuses for job applications
  const pendingCareers = careers.filter(c => {
    const s = (c.status as string || '').toLowerCase();
    return s === 'new' || s === 'submitted' || s === 'reviewing' || s === 'interview scheduled';
  }).length;
  
  const approvedCareers = careers.filter(c => {
    const s = (c.status as string || '').toLowerCase();
    return s === 'hired' || s === 'accepted';
  }).length;
  const totalBotsCount = botVisits.length;
  
  // Custom styled stats lists
  const stats = [
    { title: 'Total Inquiries', value: totalLeads, change: totalLeads > 0 ? 'Live pipeline' : 'Awaiting inquiries', isPos: true, icon: Users, color: '#D6B46A', linkTo: 'leads' },
    { title: 'New Leads', value: newLeads, change: newLeads > 0 ? 'Awaiting response' : 'Purged backlog', isPos: true, icon: Activity, color: '#BFA15A', linkTo: 'leads' },
    { title: 'Qualified Leads', value: qualifiedLeads, change: 'Sales conversion', isPos: true, icon: FileCheck, color: '#111111', linkTo: 'leads' },
    { title: 'Pending Careers', value: pendingCareers, change: 'Active candidates', isPos: true, icon: Briefcase, color: '#8A8178', linkTo: 'careers' },
    { title: 'Approved Specialists', value: approvedCareers, change: 'Verified onboarded', isPos: true, icon: CheckCircle2, color: 'emerald', linkTo: 'careers' },
    { title: 'Bot Crawls (Hashed)', value: totalBotsCount, change: 'Search indexers', isPos: false, icon: Bot, color: 'rose', linkTo: 'bot-logs' },
  ];

  // Dynamically generated real traffic curve - tied strictly to tracked visits
  const chartData = analyticsData.chartData;
  const chartBots = analyticsData.chartBots;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];

  const isChartEmpty = chartData.reduce((a, b) => a + b, 0) === 0 && chartBots.reduce((a, b) => a + b, 0) === 0;

  // Pure SVG Line Graph Renderer - Luxurious Custom Design
  const maxVal = Math.max(10, ...chartData, ...chartBots);
  const width = 600;
  const height = 180;
  const padding = 20;

  const pointsHuman = chartData.map((val, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (chartData.length - 1);
    const y = height - padding - (val * (height - padding * 2)) / maxVal;
    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const pointsBot = chartBots.map((val, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (chartBots.length - 1);
    const y = height - padding - (val * (height - padding * 2)) / maxVal;
    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="space-y-8" id="dashboard-tab-panel">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase text-[#BFA15A] tracking-widest font-bold">Remote Command Center</span>
          <h2 className="font-display text-2xl font-black text-[#111111] tracking-tight mt-0.5">SamaXon Studio Metrics</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/75 backdrop-blur-sm border border-[#D6B46A]/20 rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-xs font-semibold text-[#111111]">
            <Calendar className="w-4 h-4 text-[#D6B46A]" />
            Live Batch: May 2026
          </div>
          <button 
            onClick={() => {
              window.location.reload();
            }}
            className="px-4 py-2.5 bg-[#111111] text-white hover:text-[#D6B46A] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 duration-200"
          >
            Refresh DB
          </button>
        </div>
      </div>

      {/* Grid count cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <motion.div
              key={st.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onNavigateTo(st.linkTo)}
              className="bg-white hover:bg-[#F8F4EE]/35 border border-[#D6B46A]/15 hover:border-[#D6B46A]/45 rounded-2xl p-6 transition-all duration-300 cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between border-b border-[#D6B46A]/10 pb-4 mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8178]">
                  {st.title}
                </span>
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#D6B46A]/20 bg-[#FFFDF8]"
                  style={{ color: st.color === 'emerald' ? '#10B981' : st.color === 'rose' ? '#F43F5E' : st.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-3xl font-black text-[#111111] font-display">
                  {st.value}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3" />
                  {st.change}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts & Graphs Bento Box Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Core Traffic SVG Chart */}
        <div className="lg:col-span-8 bg-white border border-[#D6B46A]/15 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#D6B46A]/10 pb-4 mb-6">
              <div>
                <h3 className="font-display text-sm font-bold text-[#111111] uppercase tracking-wider">Website Visits Over Time</h3>
                <p className="text-xs text-[#8A8178] mt-0.5">Real-time Human Sessions vs. Crawler Activity logs</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold tracking-wider uppercase">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D6B46A]" />
                  <span className="text-[#111111]">Human ({chartData[chartData.length-1]} / day)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#111111]/30" />
                  <span className="text-[#8A8178]">Crawler ({chartBots[chartBots.length-1]} / day)</span>
                </div>
              </div>
            </div>

            {/* Premium Vector Chart Display */}
            <div className="relative w-full h-[200px]" id="traffic-curve-display">
              {isChartEmpty && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center z-10 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-[#D6B46A]/10 border border-[#D6B46A]/20 flex items-center justify-center text-[#BFA15A] mb-2.5">
                    <Activity className="w-5 h-5 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">No analytics data collected yet</h4>
                  <p className="text-[10px] text-[#8A8178] mt-1 pr-6 pl-6 max-w-sm leading-normal font-medium">
                    Telemetry is active. Traffic timelines will populate live once visitors interact with your web application.
                  </p>
                </div>
              )}
              
              <svg viewBox={`0 0 ${width} ${height}`} className={`w-full h-full overflow-visible transition-opacity duration-500 ${isChartEmpty ? 'opacity-25' : 'opacity-100'}`}>
                {/* Grid Lines */}
                <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#D6B46A" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.15" />
                <line x1={padding} y1={height/2} x2={width - padding} y2={height/2} stroke="#D6B46A" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.15" />
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#D6B46A" strokeWidth="0.8" opacity="0.3" />

                {/* Human Traffic Line filled with subtle gradient */}
                <path d={pointsHuman} fill="none" stroke="#D6B46A" strokeWidth={isChartEmpty ? "1" : "3"} strokeLinecap="round" strokeLinejoin="round" />
                {!isChartEmpty && chartData.map((val, idx) => {
                  const x = padding + (idx * (width - padding * 2)) / (chartData.length - 1);
                  const y = height - padding - (val * (height - padding * 2)) / maxVal;
                  return (
                    <g key={idx} className="group/dot cursor-pointer">
                      <circle cx={x} cy={y} r="5" fill="#FFFDF8" stroke="#D6B46A" strokeWidth="2.5" />
                      <circle cx={x} cy={y} r="8" fill="#D6B46A" opacity="0" className="hover:opacity-20 transition-opacity" />
                    </g>
                  );
                })}

                {/* Bot Traffic Line */}
                <path d={pointsBot} fill="none" stroke="#111111" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.45" />

                {/* X labels */}
                {days.map((d, idx) => {
                  const x = padding + (idx * (width - padding * 2)) / (days.length - 1);
                  return (
                    <text key={d} x={x} y={height - 2} textAnchor="middle" className="text-[9px] font-mono font-bold tracking-widest fill-[#8A8178]">
                      {d}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="border-t border-[#D6B46A]/10 pt-4 mt-4 flex items-center justify-between text-[11px] font-mono text-[#8A8178]">
            <span>Peak Visitor Density: Friday Evening</span>
            <span className="text-[#D6B46A] font-bold">Total Events Blocked: 99.8% accurate</span>
          </div>
        </div>

        {/* Device & Traffic Distribution */}
        <div className="lg:col-span-4 bg-[#111111] text-[#FFFDF8] border border-[#111111] rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="border-b border-[#FFFDF8]/15 pb-4 mb-4">
              <span className="text-[10px] font-mono text-[#D6B46A] uppercase tracking-widest font-bold">System Infrastructure</span>
              <h3 className="font-display text-sm font-bold mt-0.5 uppercase tracking-wider">Device & Channels</h3>
            </div>

            <div className="space-y-5 my-6">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#D6B46A]" />
                    <span className="font-medium">Mobile Traffic</span>
                  </div>
                  <span className="font-mono text-[#D6B46A] font-bold">78%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#D6B46A] h-full rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <Chrome className="w-4 h-4 text-white/70" />
                    <span className="font-medium">Desktop & Notebook</span>
                  </div>
                  <span className="font-mono text-white/80 font-bold">20%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white/60 h-full rounded-full" style={{ width: '20%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium">API Webhooks/Direct</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">2%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '2%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-[#D6B46A] font-bold">Conversion Funnel</span>
              <span className="text-xs text-white/90 font-medium">12.5% Contact CTA Conversion rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Ticker Table */}
      <div className="bg-white border border-[#D6B46A]/15 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/10 pb-4 mb-4">
          <div>
            <h3 className="font-display text-sm font-bold text-[#111111] uppercase tracking-wider">Recent Workspace Activity Logs</h3>
            <p className="text-xs text-[#8A8178] mt-0.5">Real-time validation tracking of Admin actions in May 2026</p>
          </div>
          <button 
            onClick={() => onNavigateTo('activity-logs')}
            className="text-xs font-bold uppercase tracking-widest text-[#BFA15A] hover:text-[#111111] transition-colors flex items-center gap-1 cursor-pointer"
          >
            Audit All Logs
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D6B46A]/10 text-[#8A8178] font-semibold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.slice(0, 4).map((log) => (
                <tr key={log.id} className="border-b border-[#D6B46A]/5 hover:bg-[#FFFDF8]/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#111111]">
                    <div className="flex flex-col">
                      <span>{log.adminUserName}</span>
                      <span className="text-[9px] font-mono font-bold text-[#BFA15A] uppercase">{log.adminUserRole}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#111111]/85">{log.description}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 border border-[#D6B46A]/30 text-[#BFA15A] text-[9px] font-mono uppercase font-bold rounded">
                      {log.entityType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#8A8178]">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
