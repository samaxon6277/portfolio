import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, CheckCircle2, ShieldCheck, Code2, 
  Layers, Globe, Terminal, FileText, 
  ChevronRight, Play, Pause, RotateCcw, 
  Zap, ArrowUpRight, Sparkles, AlertTriangle, ExternalLink
} from 'lucide-react';

export type DeliveryStepId = 'requirement' | 'development' | 'qa' | 'deployment';

export interface MilestoneItem {
  name: string;
  detail: string;
  status: 'done' | 'in-progress' | 'pending';
  completedAt?: string;
}

export interface PhaseInfo {
  id: DeliveryStepId;
  stepIndex: number;
  badgeNumber: string;
  name: string;
  phaseWindow: string; // e.g. "Hours 00 - 06"
  startHour: number;
  endHour: number;
  icon: React.ElementType;
  tagline: string;
  summary: string;
  leadArchitect: string;
  milestones: MilestoneItem[];
  outputArtifacts: string[];
}

const PHASES: PhaseInfo[] = [
  {
    id: 'requirement',
    stepIndex: 0,
    badgeNumber: '01',
    name: 'Requirement Phase',
    phaseWindow: '00h - 06h',
    startHour: 0,
    endHour: 6,
    icon: Layers,
    tagline: 'Scope Lock & Architecture Blueprint',
    summary: 'Comprehensive intake analysis, brand vector extraction, database schema design, and target performance KPI lock.',
    leadArchitect: 'Senior Systems Architect',
    milestones: [
      { name: 'Intake Spec & Conversion Goal Sign-off', detail: 'Approved high-ticket positioning & brand asset guidelines', status: 'done', completedAt: '02h 15m' },
      { name: 'Component Tree & UX Wireframe Freeze', detail: 'Locking UI interaction states and responsive container math', status: 'done', completedAt: '04h 40m' },
      { name: 'Database & Security Schema Definition', detail: 'Strict RBAC security rules and schema definitions staged', status: 'done', completedAt: '05h 50m' },
      { name: 'Initial Sandbox & Repository Init', detail: 'Private sovereign git branch and preview pipeline initialized', status: 'done', completedAt: '06h 00m' }
    ],
    outputArtifacts: [
      'Architecture Blueprint Spec v1.0',
      'Figma Token Variables & Palette Map',
      'Edge Infrastructure Manifest'
    ]
  },
  {
    id: 'development',
    stepIndex: 1,
    badgeNumber: '02',
    name: 'Development Phase',
    phaseWindow: '06h - 32h',
    startHour: 6,
    endHour: 32,
    icon: Code2,
    tagline: 'High-Velocity Component Assembly',
    summary: 'Building custom React/TypeScript components, Tailwind typography scales, live admin control panels, and edge webhook integrations.',
    leadArchitect: 'Lead Full-Stack Engineer',
    milestones: [
      { name: 'Public Digital Storefront Assembly', detail: 'High-contrast typography, hero section, and responsive grids', status: 'done', completedAt: '14h 20m' },
      { name: 'Client Control OS & Admin Modules', detail: 'Live brand customization sliders, copy editor, and asset studios', status: 'done', completedAt: '22h 45m' },
      { name: 'Real-Time Edge Webhook Pipeline', detail: 'Instant Telegram alerts and CRM bi-directional dispatching', status: 'in-progress' },
      { name: 'Dynamic Pricing & Booking Logic', detail: 'Stripe/UPI integration hooks and high-ticket conversion triggers', status: 'pending' }
    ],
    outputArtifacts: [
      'Sovereign React 18+ Applet Build',
      'Client OS Modular Control Suite',
      'Edge Webhook Dispatcher Engine'
    ]
  },
  {
    id: 'qa',
    stepIndex: 2,
    badgeNumber: '03',
    name: 'QA & Stress Testing',
    phaseWindow: '32h - 42h',
    startHour: 32,
    endHour: 42,
    icon: ShieldCheck,
    tagline: 'Lighthouse 100 Audit & Resilience',
    summary: 'Sub-second edge latency verification, cross-browser viewport stress testing, OWASP security scanning, and automated end-to-end regression.',
    leadArchitect: 'QA & Security Engineer',
    milestones: [
      { name: 'Google Lighthouse Performance Audit', detail: 'Targeting 98-100 Performance, SEO, and Accessibility index', status: 'pending' },
      { name: 'Mobile Viewport Touch & Gesture Audit', detail: 'Testing on iOS Safari, Android Chrome, and ultra-wide displays', status: 'pending' },
      { name: 'Webhook Failover & Recovery Tests', detail: 'Verifying zero-drop lead resilience under simulated traffic spikes', status: 'pending' },
      { name: 'SHA-256 Code Sanitization & Sec Review', detail: 'Strict sanitization of form inputs and client credential isolation', status: 'pending' }
    ],
    outputArtifacts: [
      'Full Lighthouse Audit Scorecard (PDF)',
      'Security Compliance Certificate',
      'Cross-Device Compatibility Matrix'
    ]
  },
  {
    id: 'deployment',
    stepIndex: 3,
    badgeNumber: '04',
    name: 'Final Deployment',
    phaseWindow: '42h - 48h',
    startHour: 42,
    endHour: 48,
    icon: Globe,
    tagline: 'Global CDN Propagation & Handover',
    summary: 'Production Cloud Run container deployment, SSL certificate issuance, custom domain cutover, and client admin credential handover.',
    leadArchitect: 'Cloud Infrastructure Specialist',
    milestones: [
      { name: 'Production Build Compilation & Bundling', detail: 'Zero-downtime container compilation with optimized asset chunks', status: 'pending' },
      { name: 'Custom Domain DNS & Edge SSL Lock', detail: 'Global Anycast CDN propagation across 300+ edge locations', status: 'pending' },
      { name: 'Client Sovereign Admin Access Handover', detail: 'Master administrator keys and custom domain ownership transfer', status: 'pending' },
      { name: 'Post-Launch Telemetry & Monitoring Active', detail: '24/7 uptime monitoring with sub-100ms incident escalation', status: 'pending' }
    ],
    outputArtifacts: [
      'Production Global URL & SSL Certificate',
      'Client Master Key Vault & Handover Doc',
      '30-Day VIP SLA Support Pass'
    ]
  }
];

const TOTAL_SPRINT_SECONDS = 48 * 3600; // 48 Hours in seconds = 172,800s

export const DeliveryProgressTracker: React.FC = () => {
  // We initialize the tracker with a realistic live sprint state (e.g., 23 hours 42 minutes elapsed in Development Phase)
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(23 * 3600 + 42 * 60 + 15);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [selectedPhaseId, setSelectedPhaseId] = useState<DeliveryStepId>('development');
  const [leadPinged, setLeadPinged] = useState<boolean>(false);

  // Live countdown clock ticker
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setElapsedSeconds(prev => {
        if (prev >= TOTAL_SPRINT_SECONDS) {
          return TOTAL_SPRINT_SECONDS;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  // Derive current phase based on elapsed seconds
  const currentElapsedHours = elapsedSeconds / 3600;
  
  const activePhase = useMemo(() => {
    if (currentElapsedHours < 6) return PHASES[0];
    if (currentElapsedHours < 32) return PHASES[1];
    if (currentElapsedHours < 42) return PHASES[2];
    return PHASES[3];
  }, [currentElapsedHours]);

  // Keep selected view synchronized with active phase unless user deliberately inspects another
  const displayedPhase = useMemo(() => {
    return PHASES.find(p => p.id === selectedPhaseId) || activePhase;
  }, [selectedPhaseId, activePhase]);

  // Countdown calculations
  const remainingSeconds = Math.max(0, TOTAL_SPRINT_SECONDS - elapsedSeconds);
  const remainingHours = Math.floor(remainingSeconds / 3600);
  const remainingMinutes = Math.floor((remainingSeconds % 3600) / 60);
  const remainingSecs = remainingSeconds % 60;

  // Percentage complete (0 to 100)
  const progressPercent = Math.min(100, Math.max(0, (elapsedSeconds / TOTAL_SPRINT_SECONDS) * 100));

  // Determine milestone status dynamically based on current phase and elapsed hours
  const getDynamicMilestoneStatus = (phase: PhaseInfo, index: number): 'done' | 'in-progress' | 'pending' => {
    if (currentElapsedHours >= phase.endHour) return 'done';
    if (currentElapsedHours < phase.startHour) return 'pending';
    
    // Inside this phase: calculate fraction
    const phaseFraction = (currentElapsedHours - phase.startHour) / (phase.endHour - phase.startHour);
    const milestoneThreshold = (index + 1) / phase.milestones.length;
    
    if (phaseFraction >= milestoneThreshold) return 'done';
    if (phaseFraction >= (index) / phase.milestones.length) return 'in-progress';
    return 'pending';
  };

  // Simulation jump helpers
  const handleJumpToPhase = (phaseId: DeliveryStepId) => {
    setSelectedPhaseId(phaseId);
    let targetHours = 2;
    if (phaseId === 'requirement') targetHours = 3.5;
    if (phaseId === 'development') targetHours = 23.5;
    if (phaseId === 'qa') targetHours = 37.0;
    if (phaseId === 'deployment') targetHours = 45.5;
    setElapsedSeconds(Math.round(targetHours * 3600));
  };

  const handleResetSprint = () => {
    setElapsedSeconds(0);
    setSelectedPhaseId('requirement');
  };

  return (
    <div className="w-full bg-[#111111] text-[#E5DBCF] rounded-[32px] sm:rounded-[40px] border border-[#D6B46A]/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden text-left" id="delivery-progress-tracker">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#BFA15A]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Title & SLA Badges */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[#D6B46A]/20">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 bg-[#D6B46A]/15 border border-[#D6B46A]/30 text-[#D6B46A] text-[10px] font-mono uppercase font-bold tracking-widest rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sovereign SLA Protocol
            </span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 text-neutral-300 text-[10px] font-mono uppercase font-semibold rounded-full">
              Contract ID: #SMX-48H-PROD
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase font-bold rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              100% On-Time Guarantee
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#FFFDF8] tracking-tight">
            48-Hour Delivery Progress Engine
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
            From initial requirement freeze to live global production deployment in 48 strictly monitored hours. Real-time telemetry, stage validation, and engineering transparency.
          </p>
        </div>

        {/* Real-time Countdown Box */}
        <div className="bg-[#181715] border border-[#D6B46A]/40 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between shrink-0 min-w-[280px] sm:min-w-[320px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D6B46A]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA15A] font-bold">
                Time Remaining
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title={isRunning ? 'Pause Clock' : 'Resume Clock'}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
              <button
                type="button"
                onClick={handleResetSprint}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Reset Sprint to Hour 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Countdown Numerals */}
          <div className="flex items-baseline justify-between gap-2 font-mono my-1">
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-black text-[#FFFDF8] tracking-tight">
                {String(remainingHours).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Hours</span>
            </div>
            <span className="text-2xl text-[#D6B46A] font-bold">:</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-black text-[#FFFDF8] tracking-tight">
                {String(remainingMinutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Mins</span>
            </div>
            <span className="text-2xl text-[#D6B46A] font-bold">:</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-black text-[#D6B46A] tracking-tight">
                {String(remainingSecs).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Secs</span>
            </div>
          </div>

          {/* Global Progress Bar */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-neutral-400">Total Progress</span>
              <span className="text-[#D6B46A] font-bold">{progressPercent.toFixed(1)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-[#D6B46A] via-[#E8D4A2] to-[#D6B46A] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(214,180,106,0.6)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Status Steps Flow: Requirement Phase -> Development -> QA/Test -> Deployment */}
      <div className="py-8 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#BFA15A] font-bold">
            Live Milestone Sequence (Click any step to inspect deliverables)
          </span>
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-neutral-400">
            <span>Simulate Phase:</span>
            {PHASES.map(phase => (
              <button
                key={phase.id}
                type="button"
                onClick={() => handleJumpToPhase(phase.id)}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  activePhase.id === phase.id
                    ? 'bg-[#D6B46A] text-[#111111] font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                }`}
              >
                {phase.badgeNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Stepper Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PHASES.map((phase, idx) => {
            const Icon = phase.icon;
            const isCurrentActive = activePhase.id === phase.id;
            const isPast = currentElapsedHours >= phase.endHour;
            const isSelected = displayedPhase.id === phase.id;

            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => setSelectedPhaseId(phase.id)}
                className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-white/[0.08] border-[#D6B46A] ring-1 ring-[#D6B46A]/60 shadow-[0_4px_25px_rgba(214,180,106,0.15)]'
                    : isCurrentActive
                    ? 'bg-white/[0.04] border-[#D6B46A]/50 hover:border-[#D6B46A]'
                    : isPast
                    ? 'bg-white/[0.02] border-emerald-500/30 hover:border-emerald-500/60'
                    : 'bg-white/[0.01] border-white/10 hover:border-white/20 opacity-75'
                }`}
              >
                {/* Active Indicator Top Glow */}
                {isCurrentActive && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D6B46A] via-[#FFFDF8] to-[#D6B46A]" />
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 text-neutral-300 border border-white/5">
                      STEP {phase.badgeNumber}
                    </span>

                    {/* Status Pill */}
                    {isPast ? (
                      <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Complete
                      </span>
                    ) : isCurrentActive ? (
                      <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-[#D6B46A]/20 text-[#D6B46A] border border-[#D6B46A]/40 flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A]" />
                        Active Sprint
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-white/5 text-neutral-400">
                        Upcoming
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`p-2 rounded-xl border ${
                      isCurrentActive
                        ? 'bg-[#D6B46A]/15 border-[#D6B46A]/40 text-[#D6B46A]'
                        : isPast
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-neutral-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm sm:text-base text-[#FFFDF8] group-hover:text-[#D6B46A] transition-colors leading-snug">
                        {phase.name}
                      </h3>
                      <span className="text-[10px] font-mono text-[#BFA15A] block">
                        {phase.phaseWindow}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed mt-2">
                    {phase.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-neutral-500">Lead: {phase.leadArchitect.split(' ')[0]}</span>
                  <span className="text-[#D6B46A] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Inspect <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Inspection Panel for the Selected Phase */}
      <div className="relative z-10 bg-[#161513] border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 mt-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D6B46A]/15 border border-[#D6B46A]/30 flex items-center justify-center text-[#D6B46A] shrink-0">
              {React.createElement(displayedPhase.icon, { className: 'w-5 h-5' })}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA15A] font-bold">
                  Phase {displayedPhase.badgeNumber} Telemetry Breakdown
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300">
                  Window: {displayedPhase.phaseWindow}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg sm:text-2xl text-[#FFFDF8]">
                {displayedPhase.name} • {displayedPhase.tagline}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-mono text-neutral-400 block">Lead Architect</span>
              <span className="text-xs font-mono font-bold text-[#FFFDF8]">{displayedPhase.leadArchitect}</span>
            </div>
            <div className="px-3.5 py-1.5 bg-[#D6B46A]/10 border border-[#D6B46A]/30 rounded-xl text-[11px] font-mono text-[#D6B46A] font-bold">
              Target SLA: 100%
            </div>
          </div>
        </div>

        {/* Phase Breakdown Grid: Milestones vs Deliverables */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Milestone Checklist (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#BFA15A] font-bold block mb-2">
              Phase Milestone Checklist &amp; Verification
            </span>

            <div className="space-y-2.5">
              {displayedPhase.milestones.map((m, mIdx) => {
                const status = getDynamicMilestoneStatus(displayedPhase, mIdx);
                const isDone = status === 'done';
                const isInProgress = status === 'in-progress';

                return (
                  <div 
                    key={mIdx}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
                      isDone 
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-neutral-200'
                        : isInProgress
                        ? 'bg-[#D6B46A]/10 border-[#D6B46A]/40 text-[#FFFDF8]'
                        : 'bg-white/[0.02] border-white/5 text-neutral-400'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : isInProgress ? (
                        <div className="w-5 h-5 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/60 flex items-center justify-center text-[#D6B46A] animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-[#D6B46A]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-500">
                          <span className="text-[9px] font-mono">{mIdx + 1}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className={`text-xs font-bold font-display ${isDone ? 'text-neutral-100' : isInProgress ? 'text-[#D6B46A]' : 'text-neutral-400'}`}>
                          {m.name}
                        </span>
                        <span className="text-[10px] font-mono shrink-0">
                          {isDone ? (
                            <span className="text-emerald-400 font-bold">VERIFIED</span>
                          ) : isInProgress ? (
                            <span className="text-[#D6B46A] font-bold animate-pulse">IN EXECUTION</span>
                          ) : (
                            <span className="text-neutral-500">QUEUED</span>
                          )}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                        {m.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deliverables & Handover Artifacts (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#BFA15A] font-bold block mb-2">
              Deliverables &amp; Verified Artifacts
            </span>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                <FileText className="w-4 h-4 text-[#D6B46A]" />
                <span className="font-bold">Artifacts Staged in Sandbox:</span>
              </div>
              <ul className="space-y-2">
                {displayedPhase.outputArtifacts.map((item, artIdx) => (
                  <li key={artIdx} className="flex items-center justify-between text-xs text-neutral-300 p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A]" />
                      <span>{item}</span>
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold">SHA-256 Validated</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick action bar */}
            <div className="p-4 bg-gradient-to-br from-[#181715] to-[#1F1E1B] border border-[#D6B46A]/20 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D6B46A]" />
                <span className="text-xs font-display font-bold text-[#FFFDF8]">
                  Need Custom Scope Adjustments?
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Our lead architect is synchronized with this 48-hour sprint. Use our priority channel to review intermediate builds or append custom integrations.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="#live-client-os-sandbox"
                  className="px-3.5 py-2 bg-[#D6B46A] hover:bg-[#E8D4A2] text-[#111111] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Open Sandbox Preview</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setLeadPinged(true);
                    setTimeout(() => setLeadPinged(false), 4000);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
                    leadPinged
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-200 border-white/10'
                  }`}
                >
                  {leadPinged ? '✓ Priority Engineer Alerted' : 'Direct Priority Ping'}
                </button>
              </div>
              {leadPinged && (
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span>VIP Priority Protocol Engaged: Lead Systems Architect notified on encrypted channel.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryProgressTracker;
