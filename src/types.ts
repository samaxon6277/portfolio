/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lead {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  city: string;
  serviceNeeded: string;
  currentProblem: string;
  desiredTimeline: string;
  budgetRange: string;
  message?: string;
  status: 'new' | 'contacted' | 'negotiating' | 'won' | 'lost';
  createdAt: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  internalNotes?: string;
  assignedTo?: string;
  complexity?: 'Basic' | 'Standard' | 'Premium' | 'Advanced' | 'Enterprise';
  selected_addons?: string[];
  estimated_min_price?: number;
  estimated_max_price?: number;
  user_budget_preference?: string;
}

export interface CareerApplication {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  roleInterestedIn: string;
  experience: string;
  whySamaXon: string;
  portfolioUrl?: string;
  resumeUrl?: string; // Standard URL or identifier
  linkedinUrl?: string;
  interviewNotes?: string;
  reviewedBy?: string;
  status: 'submitted' | 'reviewing' | 'interviewed' | 'accepted' | 'declined';
  createdAt: string;
}

export interface JobApplication {
  id: string;
  full_name: string;
  gender: string;
  age: string | number;
  city: string;
  phone: string;
  whatsapp: string;
  email: string;
  education: string;
  experience: string;
  languages: string;
  position: string;
  expected_salary: string;
  why_hire: string;
  voice_sample_link?: string;
  resume_url?: string;
  status: 'New' | 'Shortlisted' | 'Rejected' | 'Interview Scheduled' | 'Hired';
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  headline: string;
  category: string;
  painPoint: string;
  solutionCopy: string;
  deliverables: string[];
  ctaText: string;
  benefitPoints: string[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  type: string;
  category: 'websites' | 'apps' | 'brand-identity' | 'graphics' | 'automations' | 'bots' | 'admin-ready';
  problem: string;
  solution: string;
  result: string;
  visualTag: string; // e.g. "Premium Business Website", "Luxury Brand Identity"
  accentColor?: string;
  thumbnailUrl?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  founderNote?: boolean;
  rating?: number;
  photoUrl?: string;
  logoUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
}

export interface SiteSetting {
  key: string;
  value: string;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  uploadedAt: string;
}

export type DepartmentType = 'Leadership' | 'Development' | 'Design' | 'SEO' | 'Sales' | 'HR' | 'Operations';

export interface DirectoryTeamMember {
  id: string;
  name: string;
  photoUrl: string;
  position: string;
  department: DepartmentType;
  experience: string;
  skills: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  status: 'Show' | 'Hide';
  sortOrder: number;
}

export interface FounderDetails {
  photoUrl: string;
  name: string;
  designation: string;
  bio: string;
  story: string;
  mission: string;
  vision: string;
  message: string;
  experience: string[];
  achievements: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface CompanyDetails {
  overview: string;
  mission: string;
  vision: string;
  coreValues: {
    title: string;
    description: string;
    iconName?: string;
  }[];
  workingProcess: {
    step: string;
    title: string;
    description: string;
  }[];
  industriesServed: string[];
}

export interface CaseStudy {
  id: string;
  clientName: string;
  industry: string;
  beforeState: string;
  afterState: string;
  results: string[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
    photoUrl?: string;
  };
  screenshotUrl?: string;
  sortOrder: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  subtitle: string;
  features: string[];
  popular?: boolean;
  deliveryTime: string;
  sortOrder: number;
  category?: string;
}

export interface JobListing {
  id: string;
  title: string;
  department: DepartmentType;
  experienceLevel: string;
  salaryRange: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  location: string;
  description: string;
  requirements: string[];
  benefits: string[];
  status: 'Open' | 'Closed';
  createdAt: string;
}
