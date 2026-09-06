import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Bot, FileCheck, CheckCircle2, Briefcase, 
  ArrowUpRight, Activity, Calendar, Chrome, Smartphone, Globe, 
  Monitor, Compass, ShieldAlert, TrendingUp, Layers, ExternalLink,
  MessageSquare, Sparkles, Filter, Check, Clock
} from 'lucide-react';
import { Lead, JobApplication } from '../../types';
import { analytics } from '../../utils/analytics';

interface DashboardTabProps {
  leads: Lead[];
  careers: JobApplication[];
  botVisits: any[];
  activityLogs: any[];
  onNavigateTo: (targetTab: string) => void;
}

export default function DashboardTab({ 
  leads = [], 
  careers = [], 
  botVisits = [], 
  activityLogs = [], 
  onNavigateTo 
}: DashboardTabProps) {
  const [timelineView, setTimelineView] = useState<'all' | 'human' | 'bot'>('all');

  // Compute stats strictly from real database records
  const analyticsData = useMemo(() => {
    const rawEvents = (activityLogs || []).map(l => ({
      ...l,
      event_type: (l.actionType || '').toLowerCase(),
      created_at: l.createdAt || l.timestamp
    }));
    const rawBots = (botVisits || []).map(b => ({
      ...b,
      created_at: b.lastSeenAt || b.createdAt
    }));
    return analytics.computeStatsFromDatabase(rawEvents, rawBots, leads.length, careers.length);
  }, [leads.length, careers.length, botVisits, activityLogs]);

  // Aggregate authentic pipeline and deals
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => (l.status as string || '').toLowerCase() === 'new').length;
  const contactedLeads = leads.filter(l => (l.status as string || '').toLowerCase() === 'contacted').length;
  const qualifiedLeads = leads.filter(l => {
    const s = (l.status as string || '').toLowerCase();
    return s === 'negotiating' || s === 'won' || s === 'qualified' || s === 'demo sent';
  }).length;
  const wonLeads = leads.filter(l => (l.status as string || '').toLowerCase() === 'won').length;

  // Real pipeline valuation estimated from client budget selections
  const pipelineValuation = useMemo(() => {
    let totalEst = 0;
    leads.forEach(l => {
      const budget = (l.budgetRange || '').toLowerCase();
      if (budget.includes('2,50,000') || budget.includes('3,00,000') || budget.includes('enterprise')) {
        totalEst += 250000;
      } else if (budget.includes('1,00,000') || budget.includes('1,50,000') || budget.includes('premium')) {
        totalEst += 100000;
      } else if (budget.includes('50,000') || budget.includes('70,000')) {
        totalEst += 50000;
      } else {
        totalEst += 25000; // Base tier
      }
    });
    return totalEst;
  }, [leads]);

  // Authentic Careers Breakdown
  const totalApplicants = careers.length;
  const pendingCareers = careers.filter(c => {
    const s = (c.status as string || '').toLowerCase();
    return s === 'new' || s === 'submitted' || s === 'reviewing' || s === 'shortlisted';
  }).length;

  // Real Devices aggregation from activityLogs
  const deviceStats = useMemo(() => {
    let mobile = 0;
    let desktop = 0;
    let tablet = 0;
    let other = 0;

    activityLogs.forEach(log => {
      const desc = (log.description || '').toLowerCase();
      if (desc.includes('mobile')) mobile++;
      else if (desc.includes('tablet') || desc.includes('ipad')) tablet++;
      else if (desc.includes('desktop')) desktop++;
      else other++;
    });

    const total = mobile + desktop + tablet + other;
    if (total === 0) {
      return { mobile: 0, desktop: 0, tablet: 0, total: 0, mobilePct: 0, desktopPct: 0, tabletPct: 0 };
    }
    return {
      mobile,
      desktop,
      tablet,
      total,
      mobilePct: Math.round((mobile / total) * 100),
      desktopPct: Math.round((desktop / total) * 100),
      tabletPct: Math.round((tablet / total) * 100),
    };
  }, [activityLogs]);

  // Real Browser aggregation
  const browserStats = useMemo(() => {
    let chrome = 0;
    let safari = 0;
    let firefox = 0;
    let edge = 0;
    let other = 0;

    activityLogs.forEach(log => {
      const desc = (log.description || '').toLowerCase();
      if (desc.includes('chrome')) chrome++;
      else if (desc.includes('safari')) safari++;
      else if (desc.includes('firefox')) firefox++;
      else if (desc.includes('edge')) edge++;
      else other++;
    });

    const total = chrome + safari + firefox + edge + other;
    return { chrome, safari, firefox, edge, other, total };
  }, [activityLogs]);

  // Real Top Visited Routes from activity logs
  const topRoutes = useMemo(() => {
    const counts: Record<string, number> = {};
    activityLogs.forEach(log => {
      const desc = log.description || '';
      const match = desc.match(/Path:\s*([^\s,]+)/i);
      const path = match ? match[1] : (log.entityType || '/');
      counts[path] = (counts[path] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [activityLogs]);

  // Authentic Conversion Rate calculation
  const totalHumanImpressions = analyticsData.pageViews || activityLogs.length;
  const totalSubmissions = totalLeads + totalApplicants;
  const conversionRate = totalHumanImpressions > 0 
    ? ((totalSubmissions / totalHumanImpressions) * 100).toFixed(1)
    : '0.0';

  // Real AI vs Indexer Bots categorization
  const botBreakdown = useMemo(() => {
    let aiBotsCount = 0;
    let searchBotsCount = 0;
    let socialBotsCount = 0;
    let otherBotsCount = 0;

    botVisits.forEach(b => {
      const cat = (b.category || '').toLowerCase();
      const name = (b.botName || '').toLowerCase();
      if (cat.includes('ai') || name.includes('gpt') || name.includes('claude') || name.includes('perplexity')) {
        aiBotsCount++;
      } else if (cat.includes('google') || cat.includes('bing') || name.includes('spider')) {
        searchBotsCount++;
      } else if (cat.includes('social') || name.includes('whatsapp') || name.includes('telegram') || name.includes('twitter')) {
        socialBotsCount++;
      } else {
        otherBotsCount++;
      }
    });

    return {
      ai: aiBotsCount,
      search: searchBotsCount,
      social: socialBotsCount,
      other: otherBotsCount,
      total: botVisits.length
    };
  }, [botVisits]);

  // 7-day Traffic Curves (real counts)
  const chartData = analyticsData.chartData;
  const chartBots = analyticsData.chartBots;
  const days = ['6d ago', '5d ago', '4d ago', '3d ago', '2d ago', 'Yesterday', 'Today'];
  const isChartEmpty = chartData.reduce((a, b) => a + b, 0) === 0 && chartBots.reduce((a, b) => a + b, 0) === 0;

  // Pure SVG Line Graph Renderer - High Contrast Technical Curve
  const maxVal = Math.max(8, ...chartData, ...chartBots);
  const width = 640;
  const height = 190;
  const padding = 24;

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

  // Top metric cards
  const kpis = [
    {
      title: 'Active Inquiries',
      value: totalLeads,
      meta: newLeads > 0 ? `${newLeads} new awaiting review` : 'All inquiries triaged',
      icon: Users,
      color: '#D6B46A',
      linkTo: 'leads',
      trend: `${contactedLeads} in discussion`
    },
    {
      title: 'Estimated Pipeline',
      value: `₹${(pipelineValuation / 1000).toFixed(0)}k`,
      meta: `${qualifiedLeads} qualified opportunities`,
      icon: TrendingUp,
      color: '#BFA15A',
      linkTo: 'leads',
      trend: `${wonLeads} closed deals`
    },
    {
      title: 'Conversion Ratio',
      value: `${conversionRate}%`,
      meta: `${totalSubmissions} submissions / ${totalHumanImpressions} visits`,
      icon: Activity,
      color: '#10B981',
      linkTo: 'leads',
      trend: 'Session to inquiry'
    },
    {
      title: 'Talent Applications',
      value: totalApplicants,
      meta: pendingCareers > 0 ? `${pendingCareers} candidates pending` : 'All candidates reviewed',
      icon: Briefcase,
      color: '#8A8178',
      linkTo: 'careers',
      trend: 'Active growth roles'
    },
    {
      title: 'Crawler Interceptions',
      value: botVisits.length,
      meta: `${botBreakdown.ai} AI bots • ${botBreakdown.search} indexers`,
      icon: Bot,
      color: '#F43F5E',
      linkTo: 'bot-logs',
      trend: 'Server bot compass'
    },
    {
      title: 'Telemetry Stream',
      value: activityLogs.length,
      meta: 'Synchronized to Supabase',
      icon: Layers,
      color: '#111111',
      linkTo: 'activity-logs',
      trend: 'Verified site events'
    }
  ];

  return (
    <div className="space-y-8 text-left" id="dashboard-tab-panel">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/20 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#BFA15A] tracking-widest font-black">
              Executive Telemetry & CRM
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h2 className="font-display text-2xl font-black text-[#111111] tracking-tight mt-0.5">
            Operating Overview & Metrics
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white border border-[#D6B46A]/20 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs font-semibold text-[#111111] shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-[#D6B46A]" />
            <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <button 
            onClick={() => onNavigateTo('leads')}
            className="px-4 py-2 bg-[#111111] text-white hover:text-[#D6B46A] hover:bg-[#222222] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 duration-200 cursor-pointer flex items-center gap-1.5"
          >
            <span>Open Pipeline</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onNavigateTo(kpi.linkTo)}
              className="bg-white hover:bg-[#FFFDF8] border border-[#D6B46A]/20 hover:border-[#D6B46A]/50 rounded-2xl p-5 transition-all duration-300 cursor-pointer group shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8178]">
                  {kpi.title}
                </span>
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-[#D6B46A]/20 bg-[#FFFDF8] shadow-xs"
                  style={{ color: kpi.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-[#111111] font-display">
                    {kpi.value}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#BFA15A] bg-[#BFA15A]/10 px-2 py-0.5 rounded-md">
                    {kpi.trend}
                  </span>
                </div>
                <p className="text-[11px] text-[#8A8178] mt-2 font-medium">
                  {kpi.meta}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive 4-Step Conversion Funnel */}
      <div className="bg-white border border-[#D6B46A]/20 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D6B46A]/10 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-[#BFA15A] tracking-widest font-black">
                End-to-End Acquisition Stream
              </span>
            </div>
            <h3 className="font-display text-sm font-bold text-[#111111] uppercase tracking-wider mt-0.5">
              Client Conversion Funnel
            </h3>
          </div>
          <span className="text-xs font-mono text-[#8A8178]">
            Authentic Telemetry Pipeline
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Stage 1 */}
          <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#D6B46A]/20 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono uppercase font-bold text-[#8A8178] block">Step 01 • Traffic</span>
              <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider mt-1">Page Impressions</h4>
              <p className="text-2xl font-black font-display text-[#111111] mt-2">{totalHumanImpressions}</p>
            </div>
            <div className="pt-3 border-t border-[#D6B46A]/10 mt-3 text-[10px] font-mono text-[#8A8178]">
              100% Ingress Top-of-Funnel
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#D6B46A]/20 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono uppercase font-bold text-[#8A8178] block">Step 02 • Intent</span>
              <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider mt-1">CTA & Form Starts</h4>
              <p className="text-2xl font-black font-display text-[#BFA15A] mt-2">
                {analyticsData.formStarts + analyticsData.whatsappClickouts}
              </p>
            </div>
            <div className="pt-3 border-t border-[#D6B46A]/10 mt-3 text-[10px] font-mono text-[#8A8178]">
              {totalHumanImpressions > 0 
                ? `${Math.round(((analyticsData.formStarts + analyticsData.whatsappClickouts) / Math.max(1, totalHumanImpressions)) * 100)}% Engagement Rate`
                : 'Direct visitors'}
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#D6B46A]/20 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono uppercase font-bold text-[#8A8178] block">Step 03 • Action</span>
              <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider mt-1">Inquiries Received</h4>
              <p className="text-2xl font-black font-display text-[#D6B46A] mt-2">{totalSubmissions}</p>
            </div>
            <div className="pt-3 border-t border-[#D6B46A]/10 mt-3 text-[10px] font-mono text-[#8A8178]">
              {totalLeads} Inquiries • {totalApplicants} Applicants
            </div>
          </div>

          {/* Stage 4 */}
          <div className="p-4 rounded-2xl bg-[#111111] text-white border border-[#111111] flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono uppercase font-bold text-[#D6B46A] block">Step 04 • Closing</span>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mt-1">Qualified & Won</h4>
              <p className="text-2xl font-black font-display text-emerald-400 mt-2">{qualifiedLeads}</p>
            </div>
            <div className="pt-3 border-t border-white/10 mt-3 text-[10px] font-mono text-white/70">
              {wonLeads > 0 ? `${wonLeads} contracts closed` : 'Pipeline in active progress'}
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Chart & Technology Distribution Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Real Traffic Timeline Vector Graph */}
        <div className="lg:col-span-8 bg-white border border-[#D6B46A]/20 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D6B46A]/10 pb-4 mb-5">
              <div>
                <h3 className="font-display text-sm font-bold text-[#111111] uppercase tracking-wider">
                  Traffic Timeline Analysis
                </h3>
                <p className="text-xs text-[#8A8178] mt-0.5">
                  7-Day Trend: Human Ingress vs. Automated Crawler Scans
                </p>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTimelineView('all')}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase font-bold rounded-lg transition-all cursor-pointer ${
                    timelineView === 'all' 
                      ? 'bg-[#111111] text-white' 
                      : 'bg-neutral-100 text-[#8A8178] hover:bg-neutral-200'
                  }`}
                >
                  All ({chartData.reduce((a,b)=>a+b,0) + chartBots.reduce((a,b)=>a+b,0)})
                </button>
                <button
                  onClick={() => setTimelineView('human')}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase font-bold rounded-lg transition-all cursor-pointer ${
                    timelineView === 'human' 
                      ? 'bg-[#D6B46A] text-[#111111]' 
                      : 'bg-neutral-100 text-[#8A8178] hover:bg-neutral-200'
                  }`}
                >
                  Human ({chartData.reduce((a,b)=>a+b,0)})
                </button>
                <button
                  onClick={() => setTimelineView('bot')}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase font-bold rounded-lg transition-all cursor-pointer ${
                    timelineView === 'bot' 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-neutral-100 text-[#8A8178] hover:bg-neutral-200'
                  }`}
                >
                  Bots ({chartBots.reduce((a,b)=>a+b,0)})
                </button>
              </div>
            </div>

            {/* Vector Chart Display */}
            <div className="relative w-full h-[200px]" id="traffic-curve-display">
              {isChartEmpty && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center z-10 rounded-2xl">
                  <Activity className="w-6 h-6 text-[#D6B46A] mb-2 animate-pulse" />
                  <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Awaiting Traffic Timeline</h4>
                  <p className="text-[11px] text-[#8A8178] mt-1 max-w-xs leading-normal">
                    Database telemetry is active. Sessions will map across the 7-day timeline as visitors access your platform.
                  </p>
                </div>
              )}
              
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                {/* Horizontal Grid lines */}
                <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#D6B46A" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.2" />
                <line x1={padding} y1={height/2} x2={width - padding} y2={height/2} stroke="#D6B46A" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.2" />
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#D6B46A" strokeWidth="0.8" opacity="0.35" />

                {/* Human Traffic Line */}
                {(timelineView === 'all' || timelineView === 'human') && (
                  <>
                    <path 
                      d={pointsHuman} 
                      fill="none" 
                      stroke="#D6B46A" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    {chartData.map((val, idx) => {
                      const x = padding + (idx * (width - padding * 2)) / (chartData.length - 1);
                      const y = height - padding - (val * (height - padding * 2)) / maxVal;
                      return (
                        <g key={`h-${idx}`} className="group/dot">
                          <circle cx={x} cy={y} r="4.5" fill="#FFFDF8" stroke="#D6B46A" strokeWidth="2" />
                        </g>
                      );
                    })}
                  </>
                )}

                {/* Bot Traffic Line */}
                {(timelineView === 'all' || timelineView === 'bot') && (
                  <>
                    <path 
                      d={pointsBot} 
                      fill="none" 
                      stroke="#F43F5E" 
                      strokeWidth="2" 
                      strokeDasharray="4,4" 
                      opacity="0.7" 
                    />
                    {chartBots.map((val, idx) => {
                      const x = padding + (idx * (width - padding * 2)) / (chartBots.length - 1);
                      const y = height - padding - (val * (height - padding * 2)) / maxVal;
                      return (
                        <circle key={`b-${idx}`} cx={x} cy={y} r="3" fill="#F43F5E" />
                      );
                    })}
                  </>
                )}

                {/* X labels */}
                {days.map((d, idx) => {
                  const x = padding + (idx * (width - padding * 2)) / (days.length - 1);
                  return (
                    <text key={d} x={x} y={height - 4} textAnchor="middle" className="text-[9px] font-mono font-bold tracking-wider fill-[#8A8178]">
                      {d}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="border-t border-[#D6B46A]/10 pt-3 mt-4 flex flex-wrap items-center justify-between text-[11px] font-mono text-[#8A8178] gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D6B46A]" />
                <span className="text-[#111111] font-bold">Human ({chartData[6]} today)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />
                <span className="text-[#111111] font-bold">Bots ({chartBots[6]} today)</span>
              </span>
            </div>
            <span className="text-[#BFA15A] font-bold">
              Telemetries: {activityLogs.length} verified events
            </span>
          </div>
        </div>

        {/* Real Device Breakdown & AI Radar */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          
          {/* Authentic Device Distribution */}
          <div className="bg-[#111111] text-white border border-[#111111] rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="border-b border-white/10 pb-3 mb-4">
                <span className="text-[10px] font-mono text-[#D6B46A] uppercase tracking-widest font-bold">
                  Telemetry Hardware Split
                </span>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white mt-0.5">
                  Device Distribution
                </h3>
              </div>

              {deviceStats.total === 0 ? (
                <div className="py-6 text-center text-xs text-[#A89F91]">
                  Awaiting device sessions from visitor telemetry.
                </div>
              ) : (
                <div className="space-y-4 my-2">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-3.5 h-3.5 text-[#D6B46A]" />
                        <span className="font-medium text-white/90">Mobile Devices</span>
                      </div>
                      <span className="font-mono text-[#D6B46A] font-bold">
                        {deviceStats.mobilePct}% ({deviceStats.mobile})
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#D6B46A] h-full rounded-full" style={{ width: `${deviceStats.mobilePct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-3.5 h-3.5 text-white/70" />
                        <span className="font-medium text-white/90">Desktop / Laptop</span>
                      </div>
                      <span className="font-mono text-white/80 font-bold">
                        {deviceStats.desktopPct}% ({deviceStats.desktop})
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-white/60 h-full rounded-full" style={{ width: `${deviceStats.desktopPct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-medium text-white/90">Tablet & Direct Ingress</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold">
                        {deviceStats.tabletPct}% ({deviceStats.tablet})
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${deviceStats.tabletPct}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-[10px] font-mono text-[#A89F91]">
              <span>Chrome: {browserStats.chrome} • Safari: {browserStats.safari}</span>
              <span className="text-[#D6B46A]">Total: {deviceStats.total} Sessions</span>
            </div>
          </div>

          {/* AI Bot Radar Card */}
          <div className="bg-white border border-[#D6B46A]/20 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-rose-500" />
                <span className="font-display text-xs font-bold uppercase tracking-wider text-[#111111]">
                  AI Crawler Radar
                </span>
              </div>
              <button
                onClick={() => onNavigateTo('bot-logs')}
                className="text-[10px] font-mono text-[#BFA15A] hover:underline uppercase font-bold cursor-pointer"
              >
                Inspect Logs
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100">
                <span className="text-[10px] text-rose-700 font-bold block">AI Engine Bots</span>
                <span className="text-base font-black text-[#111111] font-display">{botBreakdown.ai} hits</span>
                <span className="text-[9px] text-[#8A8178] block mt-0.5">GPT, Claude, Perplexity</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
                <span className="text-[10px] text-blue-700 font-bold block">Search Indexers</span>
                <span className="text-base font-black text-[#111111] font-display">{botBreakdown.search} hits</span>
                <span className="text-[9px] text-[#8A8178] block mt-0.5">Googlebot & Bing</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Row: Recent Client Inquiries & Workspace Activity Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Client Inquiries CRM Preview */}
        <div className="lg:col-span-7 bg-white border border-[#D6B46A]/20 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#D6B46A]/10 pb-4 mb-4">
            <div>
              <h3 className="font-display text-sm font-bold text-[#111111] uppercase tracking-wider">
                Recent Inbound Inquiries
              </h3>
              <p className="text-xs text-[#8A8178] mt-0.5">
                Live leads awaiting triage or action in CRM
              </p>
            </div>
            <button
              onClick={() => onNavigateTo('leads')}
              className="text-xs font-bold uppercase tracking-widest text-[#BFA15A] hover:text-[#111111] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({totalLeads})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {leads.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#8A8178]">
              No active client inquiries recorded yet. Forms and WhatsApp conversions will appear here in real-time.
            </div>
          ) : (
            <div className="space-y-3">
              {leads.slice(0, 4).map((lead) => {
                const statusStr = (lead.status || 'new').toLowerCase();
                return (
                  <div
                    key={lead.id}
                    onClick={() => onNavigateTo('leads')}
                    className="p-3.5 rounded-2xl border border-neutral-100 hover:border-[#D6B46A]/40 bg-[#FFFDF8]/50 hover:bg-[#FFFDF8] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#111111]">
                          {lead.name || 'Anonymous Client'}
                        </span>
                        {lead.businessName && (
                          <span className="text-[10px] text-[#8A8178]">
                            • {lead.businessName}
                          </span>
                        )}
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                          statusStr === 'won' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : statusStr === 'negotiating'
                            ? 'bg-[#D6B46A]/15 text-[#BFA15A] border-[#D6B46A]/30'
                            : statusStr === 'contacted'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {lead.status || 'New'}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8A8178] mt-1 flex items-center gap-2">
                        <span>{lead.serviceNeeded || 'Web Solution'}</span>
                        <span>•</span>
                        <span>{lead.city || 'India'}</span>
                        <span>•</span>
                        <span className="font-mono">{lead.desiredTimeline || 'Under 48h'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-[#111111]">
                        {lead.budgetRange ? lead.budgetRange.split('(')[0] : 'Custom'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity Audit Table */}
        <div className="lg:col-span-5 bg-white border border-[#D6B46A]/20 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#D6B46A]/10 pb-4 mb-4">
              <div>
                <h3 className="font-display text-sm font-bold text-[#111111] uppercase tracking-wider">
                  Live Audit Trail
                </h3>
                <p className="text-xs text-[#8A8178] mt-0.5">
                  Chronological workspace events
                </p>
              </div>
              <button
                onClick={() => onNavigateTo('activity-logs')}
                className="text-xs font-bold uppercase tracking-widest text-[#BFA15A] hover:text-[#111111] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Audit</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activityLogs.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#8A8178]">
                No verified activity events logged yet.
              </div>
            ) : (
              <div className="space-y-3">
                {activityLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="text-xs border-b border-neutral-100 pb-2.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-[#111111] truncate">
                        {log.adminUserName || 'Visitor'}
                      </span>
                      <span className="text-[9px] font-mono text-[#8A8178] shrink-0">
                        {new Date(log.createdAt || log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8A8178] line-clamp-1 mt-0.5">
                      {log.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-100 mt-3 flex items-center justify-between text-[10px] font-mono text-[#8A8178]">
            <span>Audit retention: Indefinite</span>
            <span className="text-[#D6B46A] font-bold">100% Immutable</span>
          </div>
        </div>

      </div>

    </div>
  );
}
