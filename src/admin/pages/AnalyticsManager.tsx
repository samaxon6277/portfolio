import React, { useState, useEffect } from "react";
import { BarChart2, TrendingUp, Users, Clock, Globe, Laptop, Smartphone } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Sector, Label } from "recharts";
import { motion } from "framer-motion";
import CustomSelect from "../components/CustomSelect";
import { collection, onSnapshot, query, where, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

const COLORS = ['#2984FF', '#FE774E', '#10B981', '#F59E0B'];

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, index } = props;
  const rawColor = COLORS[index % COLORS.length];

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0px 0px 8px ${rawColor}80)`, outline: 'none' }}
        cornerRadius={6}
      />
    </g>
  );
};

export default function AnalyticsManager() {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const [filter, setFilter] = useState("Last 7 Days");
  
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [sourceData, setSourceData] = useState<any[]>([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [pageViews, setPageViews] = useState(0);

  useEffect(() => {
    let daysToSubtract = 7;
    if (filter === "Last 30 Days") daysToSubtract = 30;
    else if (filter === "This Year") daysToSubtract = 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToSubtract);

    // Watch visitor_logs
    const qLogs = query(collection(db, "visitor_logs"), where("createdAt", ">=", Timestamp.fromDate(startDate)));
    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      setTotalVisitors(snapshot.size);
      
      const logs = snapshot.docs.map(doc => doc.data());
      
      // Compute Traffic Data
      const trafficMap = new Map();
      logs.forEach(log => {
         if(log.createdAt) {
            const date = log.createdAt.toDate().toLocaleDateString('en-US', { weekday: 'short' });
            if(!trafficMap.has(date)) trafficMap.set(date, { views: 0, visitors: 0 });
            trafficMap.get(date).visitors += 1;
         }
      });

      // Simple source aggregation
      const srcMap = new Map();
      logs.forEach(log => {
         const source = log.source || 'Direct';
         srcMap.set(source, (srcMap.get(source) || 0) + 1);
      });
      
      const sData = Array.from(srcMap.entries()).map(([name, value]) => ({ name, value }));
      setSourceData(sData.length ? sData : [
        { name: 'Direct', value: 0 },
        { name: 'Social', value: 0 },
        { name: 'Referral', value: 0 }
      ]);
      
      // Convert traffic map
      const tData = Array.from(trafficMap.entries()).map(([name, data]) => ({ name, ...data }));
      setTrafficData(tData.length ? tData : [
        { name: 'Mon', views: 0, visitors: 0 },
        { name: 'Tue', views: 0, visitors: 0 },
        { name: 'Wed', views: 0, visitors: 0 },
      ]);
    });

    // Watch page views
    const qViews = query(collection(db, "page_views"), where("createdAt", ">=", Timestamp.fromDate(startDate)));
    const unsubViews = onSnapshot(qViews, (snapshot) => {
      setPageViews(snapshot.size);
      
      setTrafficData(prev => {
         const newMap = new Map<string, any>(prev.map(p => [p.name, { ...p, views: 0 }]));
         snapshot.docs.forEach(doc => {
            const data = doc.data();
            if(data.createdAt) {
               const date = data.createdAt.toDate().toLocaleDateString('en-US', { weekday: 'short' });
               if(newMap.has(date)) {
                  const existing = newMap.get(date);
                  newMap.set(date, { ...existing, views: (existing.views || 0) + 1 });
               }
            }
         });
         return Array.from(newMap.values());
      });
    });

    return () => {
      unsubLogs();
      unsubViews();
    };
  }, [filter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Analytics</h1>
          <p className="text-[#A8AFBD] mt-1">Detailed business and traffic insights.</p>
        </div>
        <CustomSelect 
          value={filter}
          onChange={setFilter}
          options={["Last 7 Days", "Last 30 Days", "This Year"]}
          className="w-40"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { icon: Users, label: "Total Visitors", val: totalVisitors.toLocaleString(), change: "Real", pos: true },
          { icon: TrendingUp, label: "Page Views", val: pageViews.toLocaleString(), change: "Real", pos: true },
          { icon: Clock, label: "Avg Session", val: "N/A", change: "N/A", pos: false },
          { icon: BarChart2, label: "Bounce Rate", val: "N/A", change: "N/A", pos: true }
        ].map((s, i) => (
           <motion.div 
             key={i} 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.05 }}
             className="bg-[#1B1B1B] border border-white/5 p-6 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-shadow"
           >
             <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                 <s.icon className="w-5 h-5 text-white" />
               </div>
               <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.pos ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                 {s.change}
               </span>
             </div>
             <p className="text-sm text-[#A8AFBD]">{s.label}</p>
             <h3 className="text-2xl font-display font-bold mt-1 text-white">{s.val}</h3>
           </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-[#1B1B1B] border border-white/5 p-6 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-shadow"
        >
           <h3 className="text-lg font-bold font-display mb-6">Traffic & Views</h3>
           <div className="h-80 min-h-[300px] [&_*:focus]:outline-none [&_*:focus-visible]:outline-none">
             <ResponsiveContainer width="100%" height="100%" minHeight={300}>
               <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2984FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2984FF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#A8AFBD" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#A8AFBD" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#101010', borderColor: '#ffffff10', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} cursor={{ stroke: '#ffffff10', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="views" name="Page Views" stroke="#2984FF" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" activeDot={{ r: 6, strokeWidth: 0, stroke: 'none', style: { filter: 'drop-shadow(0px 0px 8px #2984FF)' } }} />
                  <Area type="monotone" dataKey="visitors" name="Unique Visitors" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorVis)" activeDot={{ r: 6, strokeWidth: 0, stroke: 'none', style: { filter: 'drop-shadow(0px 0px 8px #10B981)' } }} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1B1B1B] border border-white/5 p-6 rounded-2xl flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-shadow"
        >
           <h3 className="text-lg font-bold font-display mb-6">Traffic Sources</h3>
           <div className="flex-1 min-h-[300px] [&_*:focus]:outline-none [&_*:focus-visible]:outline-none">
             <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <PieChart>
                  <defs>
                    {COLORS.map((color, idx) => (
                      <linearGradient key={idx} id={`pieGradient${idx}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={1} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie 
                    data={sourceData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={70} 
                    outerRadius={90} 
                    paddingAngle={8} 
                    dataKey="value"
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={1500}
                    animationEasing="ease-out"
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(undefined)}
                    onClick={(_, index) => setActiveIndex(index)}
                    stroke="none"
                    cornerRadius={6}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#pieGradient${index % COLORS.length})`} />
                    ))}
                    <Label 
                      value="Sources" 
                      position="center"
                      fill="#fff"
                      style={{ fontSize: '16px', fontWeight: 'bold' }}
                    />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#101010', borderColor: '#ffffff10', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={false}
                  />
                </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="space-y-3 mt-4">
              {sourceData.map((d, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(undefined)}
                >
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i], boxShadow: `0 0 8px ${COLORS[i]}80` }}></div>
                     <span className="text-sm text-[#A8AFBD]">{d.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{d.value}</span>
                </motion.div>
              ))}
           </div>
        </motion.div>
      </div>
    </div>
  );
}
