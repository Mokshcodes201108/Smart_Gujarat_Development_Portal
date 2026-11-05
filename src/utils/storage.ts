import { Project, CoordinationRequest, AppNotification, CitizenFeedback, User, AuditLog } from '../types';
import { INITIAL_PROJECTS, INITIAL_COORDINATION_REQUESTS, INITIAL_NOTIFICATIONS } from '../data/sampleProjects';

const STORAGE_KEYS = {
  PROJECTS: 'sgdp_projects_v2',
  COORDINATION: 'sgdp_coordination_v2',
  NOTIFICATIONS: 'sgdp_notifications_v2',
  FEEDBACK: 'sgdp_feedback_v2',
  CURRENT_USER: 'sgdp_auth_user_v2',
  USERS: 'sgdp_registered_users_v2',
  AUDIT_LOGS: 'sgdp_audit_logs_v2',
  CONFIG: 'sgdp_config_v2'
};

export const DEMO_USERS: Record<string, User> = {
  moksh: {
    id: 'USR-MOKSH',
    name: 'Moksh Patel',
    email: 'patelmoksh201108@gmail.com',
    password: 'moksh',
    role: 'admin',
    designation: 'District Lead Innovation Architect & Administrator',
    department: 'District Innovation Cell (SFIC) & DDO Bharuch',
    phone: '+91 98250 88990',
    village: 'Bharuch City',
    taluka: 'Bharuch',
    status: 'active',
    createdAt: '2026-01-01'
  },
  admin: {
    id: 'USR-001',
    name: 'Shri B. K. Solanki, IAS',
    email: 'ddo.bharuch@gujarat.gov.in',
    password: 'admin',
    role: 'admin',
    designation: 'District Development Officer (DDO), Bharuch',
    department: 'District Administration / DDO Bharuch',
    phone: '+91 2642 242100',
    village: 'Collectorate Complex',
    taluka: 'Bharuch',
    status: 'active',
    createdAt: '2025-06-15'
  },
  officer: {
    id: 'USR-002',
    name: 'Er. Rajesh K. Patel',
    email: 'officer.rnb@gujarat.gov.in',
    password: 'officer',
    role: 'officer',
    designation: 'Executive Engineer (R&B Division)',
    department: 'Roads and Buildings Department',
    phone: '+91 98250 11221',
    employeeId: 'R&B-EE-2041',
    village: 'Bahumali Bhavan',
    taluka: 'Bharuch',
    status: 'active',
    createdAt: '2025-07-20'
  },
  officer_panchayat: {
    id: 'USR-004',
    name: 'Smt. Minaxi Ben Solanki',
    email: 'ee-panchayat-bha@gujarat.gov.in',
    password: 'officer',
    role: 'officer',
    designation: 'Executive Engineer (Panchayat Division)',
    department: 'Panchayat Department',
    phone: '+91 98254 99001',
    employeeId: 'PANCH-EE-1092',
    village: 'District Panchayat',
    taluka: 'Bharuch',
    status: 'active',
    createdAt: '2025-08-10'
  },
  citizen: {
    id: 'USR-003',
    name: 'Hardik K. Parmar',
    email: 'citizen.bharuch@gujarat.nic.in',
    password: 'citizen',
    role: 'citizen',
    designation: 'Resident of Vagra / Bharuch Citizen',
    department: 'General Public',
    phone: '+91 94285 33441',
    village: 'Vagra',
    taluka: 'Vagra',
    status: 'active',
    createdAt: '2025-11-04'
  }
};

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-001',
    action: 'AI Duplicate Intercepted',
    user: 'SGDP Sentinel Engine',
    role: 'admin',
    department: 'AI Core',
    details: '92% similarity detected between GJ-BH-2026-004 and GJ-BH-2026-015 in Village Vagra.',
    category: 'duplicate',
    timestamp: '2026-02-05 10:14:22'
  },
  {
    id: 'AUD-002',
    action: 'Coordination Clearance',
    user: 'Shri B. K. Solanki, IAS',
    role: 'admin',
    department: 'DDO Office',
    details: 'Approved resolution CR-2026-002 between DMF and GIDC. ₹28 Lakhs redirected.',
    category: 'coordination',
    timestamp: '2026-02-04 15:30:10'
  },
  {
    id: 'AUD-003',
    action: 'Project Sanction Approved',
    user: 'Moksh Patel',
    role: 'admin',
    department: 'District Innovation Cell',
    details: 'Verified high-level bridge project GJ-BH-2026-002 completion certificate.',
    category: 'project',
    timestamp: '2026-02-03 09:45:00'
  },
  {
    id: 'AUD-004',
    action: 'Officer Registration Approved',
    user: 'Shri B. K. Solanki, IAS',
    role: 'admin',
    department: 'DDO Office',
    details: 'Verified credentials for Er. Rajesh K. Patel (Executive Engineer R&B).',
    category: 'admin',
    timestamp: '2026-02-01 11:20:45'
  }
];

const INITIAL_FEEDBACK: CitizenFeedback[] = [
  {
    id: 'FB-001',
    projectId: 'GJ-BH-2026-004',
    projectName: 'Asphalt Road Strengthening from Village Square to Vagra Mandir',
    citizenName: 'Dhaval Patel',
    citizenContact: '9825123456',
    village: 'Vagra',
    feedbackType: 'Duplicate Work Report',
    rating: 2,
    comment: 'Panchayat members were measuring the same road last week for CC road work. Please don’t dig up the freshly tarred road! Coordinate between R&B and Panchayat!',
    submittedAt: '2026-02-03T11:20:00Z',
    status: 'Under Review'
  },
  {
    id: 'FB-002',
    projectId: 'GJ-BH-2026-002',
    projectName: 'Major High-Level Bridge across Bhukhi Khadi on Amod-Jambusar Road',
    citizenName: 'Kishore Parmar',
    citizenContact: '9427891234',
    village: 'Achhod',
    feedbackType: 'Appreciation',
    rating: 5,
    comment: 'The new high-level bridge has saved our children from getting stranded during river flooding. Excellent construction quality and timely completion.',
    submittedAt: '2026-01-25T15:40:00Z',
    status: 'Addressed'
  }
];

export function getStoredProjects(): Project[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading projects from storage', e);
  }
  // Initialize default
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  return INITIAL_PROJECTS;
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Error saving projects to storage', e);
  }
}

export function getStoredCoordinationRequests(): CoordinationRequest[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COORDINATION);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading coordination requests', e);
  }
  localStorage.setItem(STORAGE_KEYS.COORDINATION, JSON.stringify(INITIAL_COORDINATION_REQUESTS));
  return INITIAL_COORDINATION_REQUESTS;
}

export function saveCoordinationRequests(requests: CoordinationRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COORDINATION, JSON.stringify(requests));
  } catch (e) {
    console.error('Error saving coordination requests', e);
  }
}

export function getStoredNotifications(): AppNotification[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading notifications', e);
  }
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  return INITIAL_NOTIFICATIONS;
}

export function saveNotifications(notifications: AppNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (e) {
    console.error('Error saving notifications', e);
  }
}

export function getStoredFeedback(): CitizenFeedback[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading feedback', e);
  }
  localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(INITIAL_FEEDBACK));
  return INITIAL_FEEDBACK;
}

export function saveFeedback(feedback: CitizenFeedback[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedback));
  } catch (e) {
    console.error('Error saving feedback', e);
  }
}

export function getStoredUser(): User {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading auth user', e);
  }
  // Default to DDO Bharuch Admin for optimal full-feature experience
  return DEMO_USERS.admin;
}

export function saveStoredUser(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving user', e);
  }
}

export function getStoredUsers(): User[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading registered users from storage', e);
  }
  const initial = Object.values(DEMO_USERS);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initial));
  return initial;
}

export function saveStoredUsers(users: User[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users to storage', e);
  }
}

export function registerNewUser(user: User): { success: boolean; message: string; user?: User } {
  const users = getStoredUsers();
  const existing = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (existing) {
    return { success: false, message: 'An account with this email address already exists.' };
  }

  const updatedUsers = [user, ...users];
  saveStoredUsers(updatedUsers);

  // Log in audit trail
  addAuditLog({
    action: 'User Registered',
    user: user.name,
    role: user.role,
    department: user.department,
    details: `New account registered as ${user.role} (${user.department || user.village || 'Citizen'}).`,
    category: 'auth'
  });

  return { success: true, message: 'Registration successful! You may now sign in.', user };
}

export function getStoredAuditLogs(): AuditLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading audit logs', e);
  }
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  return INITIAL_AUDIT_LOGS;
}

export function saveStoredAuditLogs(logs: AuditLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving audit logs', e);
  }
}

export function addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
  const logs = getStoredAuditLogs();
  const newLog: AuditLog = {
    ...entry,
    id: `AUD-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  saveStoredAuditLogs([newLog, ...logs]);
}

export interface DistrictConfig {
  duplicateThreshold: number; // e.g. 70
  proximityRadiusKm: number; // e.g. 1.5
  autoFlagOnSubmission: boolean;
  blockDuplicateSanctions: boolean;
  publicTransparencyMode: boolean;
}

export const DEFAULT_CONFIG: DistrictConfig = {
  duplicateThreshold: 70,
  proximityRadiusKm: 1.5,
  autoFlagOnSubmission: true,
  blockDuplicateSanctions: true,
  publicTransparencyMode: true
};

export function getStoredConfig(): DistrictConfig {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading config', e);
  }
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
  return DEFAULT_CONFIG;
}

export function saveStoredConfig(config: DistrictConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving config', e);
  }
}

export function resetToDemoDefaults(): void {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  localStorage.setItem(STORAGE_KEYS.COORDINATION, JSON.stringify(INITIAL_COORDINATION_REQUESTS));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(INITIAL_FEEDBACK));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(Object.values(DEMO_USERS)));
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
}

