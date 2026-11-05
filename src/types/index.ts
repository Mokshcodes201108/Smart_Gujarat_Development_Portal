export type UserRole = 'admin' | 'officer' | 'citizen';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department?: string;
  designation: string;
  phone?: string;
  village?: string;
  taluka?: string;
  employeeId?: string;
  status?: 'active' | 'pending_approval' | 'suspended';
  createdAt?: string;
  avatar?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  role: UserRole;
  department?: string;
  details: string;
  category: 'auth' | 'project' | 'duplicate' | 'coordination' | 'admin';
  timestamp: string;
  ipAddress?: string;
}

export type ProjectStatus = 
  | 'Proposed' 
  | 'Pending Approval' 
  | 'Approved' 
  | 'In Progress' 
  | 'Completed' 
  | 'Cancelled';

export type ProjectCategory = 
  | 'Road & Transportation' 
  | 'Water Supply & Sanitation' 
  | 'Drainage & Sewerage' 
  | 'Street Lighting & Energy' 
  | 'Education & Anganwadi' 
  | 'Healthcare' 
  | 'Community & Culture' 
  | 'Industrial Infrastructure';

export interface Project {
  id: string;
  projectName: string;
  department: string;
  scheme: string;
  district: string;
  taluka: string;
  village: string;
  category: ProjectCategory;
  description: string;
  estimatedBudget: number; // in Rupees (INR)
  sanctionedBudget: number;
  utilizedFunds: number;
  startDate: string;
  expectedCompletionDate: string;
  status: ProjectStatus;
  responsibleOfficer: string;
  officerContact?: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  isFlaggedDuplicate?: boolean;
  duplicateConfidence?: number;
  duplicateOfProjectId?: string;
}

export interface DuplicateMatch {
  existingProject: Project;
  candidateProject: Partial<Project>;
  overallScore: number; // 0 - 100
  titleScore: number;
  locationScore: number;
  categoryScore: number;
  scopeScore: number;
  distanceKm: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  matchingFactors: string[];
  recommendedAction: string;
  potentialSavings: number;
}

export interface CoordinationRequest {
  id: string;
  sourceProjectId: string;
  sourceProjectName: string;
  sourceDepartment: string;
  targetProjectId: string;
  targetProjectName: string;
  targetDepartment: string;
  subject: string;
  message: string;
  proposedResolution: 'Merge' | 'Reschedule' | 'Re-scope' | 'Cancel Duplicate' | 'Proceed with Conditions';
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Resolved';
  createdAt: string;
  updatedAt: string;
  senderName: string;
  senderDesignation: string;
  resolutionNotes?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'duplicate_alert' | 'approval_required' | 'coordination_request' | 'project_completed' | 'system';
  timestamp: string;
  read: boolean;
  relatedProjectId?: string;
  relatedCoordinationId?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface CitizenFeedback {
  id: string;
  projectId: string;
  projectName: string;
  citizenName: string;
  citizenContact: string;
  village: string;
  feedbackType: 'Appreciation' | 'Delayed Work' | 'Poor Quality' | 'Duplicate Work Report' | 'General Query';
  rating: number; // 1 to 5
  comment: string;
  submittedAt: string;
  status: 'New' | 'Under Review' | 'Addressed';
}

export interface DepartmentInfo {
  name: string;
  code: string;
  headOfficer: string;
  designation: string;
  contactEmail: string;
  phone: string;
  officeAddress: string;
  color: string;
}
