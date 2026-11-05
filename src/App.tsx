import React, { useState, useEffect } from 'react';
import { 
  Project, 
  CoordinationRequest, 
  AppNotification, 
  CitizenFeedback, 
  User, 
  DuplicateMatch 
} from './types';
import { 
  getStoredProjects, 
  saveProjects, 
  getStoredCoordinationRequests, 
  saveCoordinationRequests, 
  getStoredNotifications, 
  saveNotifications, 
  getStoredFeedback, 
  saveFeedback, 
  getStoredUser, 
  saveStoredUser, 
  resetToDemoDefaults,
  DEMO_USERS 
} from './utils/storage';
import { scanAllDuplicates } from './utils/duplicateDetector';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProjectFormModal } from './components/ProjectFormModal';
import { DuplicateWarningModal } from './components/DuplicateWarningModal';

// Views
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { DashboardView } from './views/DashboardView';
import { ProjectManagementView } from './views/ProjectManagementView';
import { DuplicateDetectionView } from './views/DuplicateDetectionView';
import { MapView } from './views/MapView';
import { CoordinationView } from './views/CoordinationView';
import { FundManagementView } from './views/FundManagementView';
import { CitizenPortalView } from './views/CitizenPortalView';
import { NotificationView } from './views/NotificationView';
import { AdminView } from './views/AdminView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    // Default to Moksh Patel (District Innovation Lead) for personalized experience
    const stored = getStoredUser();
    return stored.email === 'patelmoksh201108@gmail.com' ? stored : DEMO_USERS.moksh;
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Core Data Stores
  const [projects, setProjects] = useState<Project[]>(getStoredProjects);
  const [coordinationRequests, setCoordinationRequests] = useState<CoordinationRequest[]>(getStoredCoordinationRequests);
  const [notifications, setNotifications] = useState<AppNotification[]>(getStoredNotifications);
  const [feedbackList, setFeedbackList] = useState<CitizenFeedback[]>(getStoredFeedback);

  // Modal States
  const [selectedDetailProject, setSelectedDetailProject] = useState<Project | null>(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Duplicate Warning Modal State
  const [duplicateWarningState, setDuplicateWarningState] = useState<{
    isOpen: boolean;
    matches: DuplicateMatch[];
    candidate: Partial<Project>;
  }>({
    isOpen: false,
    matches: [],
    candidate: {}
  });

  // Calculate live duplicate metrics
  const scanData = scanAllDuplicates(projects);
  const duplicateCount = scanData.duplicatePairs.length;
  const totalSavings = scanData.totalPotentialSavings;
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const pendingApprovalsCount = projects.filter(p => p.status === 'Pending Approval').length;
  const pendingCoordinationCount = coordinationRequests.filter(r => r.status === 'Pending').length;

  // Sync to storage on state updates
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    saveCoordinationRequests(coordinationRequests);
  }, [coordinationRequests]);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    saveFeedback(feedbackList);
  }, [feedbackList]);

  useEffect(() => {
    saveStoredUser(currentUser);
  }, [currentUser]);

  // Handle User Switch / Role Change
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'citizen') {
      setActiveTab('citizen');
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    if (user.role === 'citizen') {
      setActiveTab('citizen');
    } else {
      setActiveTab('dashboard');
    }
  };

  // Reset to initial demo dataset for Hackathon presentation
  const handleResetData = () => {
    resetToDemoDefaults();
    setProjects(getStoredProjects());
    setCoordinationRequests(getStoredCoordinationRequests());
    setNotifications(getStoredNotifications());
    setFeedbackList(getStoredFeedback());
  };

  // Project CRUD Actions
  const handleSaveProject = (project: Project) => {
    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === project.id ? project : p));
    } else {
      setProjects(prev => [project, ...prev]);
      // Trigger notification for new project
      const newNotif: AppNotification = {
        id: `NOTIF-${Date.now()}`,
        title: `New Proposal: ${project.projectName}`,
        message: `${project.department} registered proposal ${project.id} in ${project.village}.`,
        type: 'approval_required',
        timestamp: 'Just now',
        read: false,
        relatedProjectId: project.id,
        priority: 'medium'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
    setEditingProject(null);
  };

  const handleDeleteProject = (project: Project) => {
    setProjects(prev => prev.filter(p => p.id !== project.id));
    if (selectedDetailProject?.id === project.id) {
      setSelectedDetailProject(null);
    }
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setIsProjectFormOpen(true);
    setSelectedDetailProject(null);
  };

  // Duplicate Coordination Integration
  const handleInitiateCoordination = (match: DuplicateMatch) => {
    const existing = match.existingProject;
    const candidate = match.candidateProject;

    const newReq: CoordinationRequest = {
      id: `CR-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      sourceProjectId: candidate.id || 'NEW-PROPOSAL',
      sourceProjectName: candidate.projectName || 'New Proposal',
      sourceDepartment: candidate.department || currentUser.department || 'Initiating Dept',
      targetProjectId: existing.id,
      targetProjectName: existing.projectName,
      targetDepartment: existing.department,
      subject: `AI Duplicate Alert: Overlap in ${existing.village} (${match.overallScore}% Similarity)`,
      message: `SGDP AI Sentinel flagged a ${match.overallScore}% overlap. ${match.matchingFactors.join('. ')}. Recommended action: ${match.recommendedAction}`,
      proposedResolution: 'Merge',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      senderName: currentUser.name,
      senderDesignation: currentUser.designation
    };

    setCoordinationRequests(prev => [newReq, ...prev]);

    // Create system notification
    const alertNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: `Coordination Initiated: ${existing.village}`,
      message: `Request filed between ${candidate.department || 'Initiator'} and ${existing.department}.`,
      type: 'coordination_request',
      timestamp: 'Just now',
      read: false,
      relatedCoordinationId: newReq.id,
      priority: 'high'
    };
    setNotifications(prev => [alertNotif, ...prev]);

    // Close warning modal & navigate to coordination tab
    setDuplicateWarningState(prev => ({ ...prev, isOpen: false }));
    setIsProjectFormOpen(false);
    setActiveTab('coordination');
  };

  // If user forces save despite duplicate warning
  const handleForceSaveDuplicate = () => {
    if (duplicateWarningState.candidate.projectName) {
      const candidate = duplicateWarningState.candidate;
      const completed: Project = {
        ...(candidate as Project),
        id: candidate.id || `GJ-BH-2026-${Math.floor(Math.random() * 900) + 100}`,
        district: 'Bharuch',
        taluka: candidate.taluka || 'Vagra',
        village: candidate.village || 'Vagra',
        sanctionedBudget: candidate.sanctionedBudget || candidate.estimatedBudget || 0,
        utilizedFunds: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFlaggedDuplicate: true,
        duplicateConfidence: duplicateWarningState.matches[0]?.overallScore,
        duplicateOfProjectId: duplicateWarningState.matches[0]?.existingProject.id
      };
      setProjects(prev => [completed, ...prev]);
    }
    setDuplicateWarningState({ isOpen: false, matches: [], candidate: {} });
    setIsProjectFormOpen(false);
  };

  // Coordination updates
  const handleUpdateCoordination = (req: CoordinationRequest) => {
    setCoordinationRequests(prev => prev.map(r => r.id === req.id ? req : r));
  };

  const handleAddCoordination = (req: CoordinationRequest) => {
    setCoordinationRequests(prev => [req, ...prev]);
  };

  // Notification actions
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Feedback actions
  const handleAddFeedback = (feedback: CitizenFeedback) => {
    setFeedbackList(prev => [feedback, ...prev]);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthMode('login');
  };

  // If logged out, render the LoginView or RegisterView
  if (!isLoggedIn) {
    if (authMode === 'register') {
      return (
        <RegisterView
          onRegisterSuccess={(newUser) => {
            handleLogin(newUser);
          }}
          onGoToLogin={() => setAuthMode('login')}
        />
      );
    }
    return (
      <LoginView
        onLogin={handleLogin}
        onGoToRegister={() => setAuthMode('register')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Global Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        notifications={notifications}
        onOpenNotifications={() => setActiveTab('notifications')}
        onResetData={handleResetData}
        onSelectProject={(p) => setSelectedDetailProject(p)}
        allProjects={projects}
        duplicateCount={duplicateCount}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Container: Sidebar + Viewport */}
      <div className="flex-1 flex max-w-[1700px] w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          userRole={currentUser.role}
          duplicateCount={duplicateCount}
          unreadNotifications={unreadNotifications}
          pendingApprovalsCount={pendingApprovalsCount}
          pendingCoordinationCount={pendingCoordinationCount}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
        />

        {/* Dynamic Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              projects={projects}
              coordinationRequests={coordinationRequests}
              notifications={notifications}
              currentUser={currentUser}
              duplicateCount={duplicateCount}
              totalSavings={totalSavings}
              onNavigateTab={setActiveTab}
              onOpenNewProject={() => {
                setEditingProject(null);
                setIsProjectFormOpen(true);
              }}
              onSelectProject={(p) => setSelectedDetailProject(p)}
            />
          )}

          {activeTab === 'duplicates' && (
            <DuplicateDetectionView
              projects={projects}
              onInitiateCoordination={handleInitiateCoordination}
              onNavigateTab={setActiveTab}
              onSelectProject={(p) => setSelectedDetailProject(p)}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectManagementView
              projects={projects}
              onOpenNewProject={() => {
                setEditingProject(null);
                setIsProjectFormOpen(true);
              }}
              onEditProject={handleOpenEdit}
              onDeleteProject={handleDeleteProject}
              onSelectProject={(p) => setSelectedDetailProject(p)}
              userRole={currentUser.role}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'map' && (
            <MapView
              projects={projects}
              onSelectProject={(p) => setSelectedDetailProject(p)}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'coordination' && (
            <CoordinationView
              coordinationRequests={coordinationRequests}
              onUpdateCoordinationRequest={handleUpdateCoordination}
              onAddCoordinationRequest={handleAddCoordination}
              projects={projects}
              currentUser={currentUser}
              onSelectProject={(p) => setSelectedDetailProject(p)}
            />
          )}

          {activeTab === 'funds' && (
            <FundManagementView
              projects={projects}
              totalSavings={totalSavings}
            />
          )}

          {activeTab === 'citizen' && (
            <CitizenPortalView
              projects={projects}
              feedbackList={feedbackList}
              onSubmitFeedback={handleAddFeedback}
              onNavigateTab={setActiveTab}
              onSelectProject={(p) => setSelectedDetailProject(p)}
            />
          )}

          {activeTab === 'admin' && (
            <AdminView
              currentUser={currentUser}
              onResetData={handleResetData}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationView
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onNavigateTab={setActiveTab}
              onSelectProject={(p) => setSelectedDetailProject(p)}
              allProjects={projects}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <ProjectDetailModal
        project={selectedDetailProject}
        isOpen={Boolean(selectedDetailProject)}
        onClose={() => setSelectedDetailProject(null)}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteProject}
        onViewDuplicate={(dupId) => {
          const dup = projects.find(p => p.id === dupId);
          if (dup) setSelectedDetailProject(dup);
        }}
        userRole={currentUser.role}
      />

      <ProjectFormModal
        isOpen={isProjectFormOpen}
        onClose={() => {
          setIsProjectFormOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        initialProject={editingProject}
        existingProjects={projects}
        onTriggerDuplicateWarning={(matches, candidate) => {
          setDuplicateWarningState({
            isOpen: true,
            matches,
            candidate
          });
        }}
      />

      <DuplicateWarningModal
        isOpen={duplicateWarningState.isOpen}
        onClose={() => setDuplicateWarningState({ isOpen: false, matches: [], candidate: {} })}
        matches={duplicateWarningState.matches}
        candidateProject={duplicateWarningState.candidate}
        onProceedAnyway={handleForceSaveDuplicate}
        onInitiateCoordination={handleInitiateCoordination}
      />
    </div>
  );
}
