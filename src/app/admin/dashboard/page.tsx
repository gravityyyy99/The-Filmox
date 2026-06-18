'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';
import { usePortfolio } from '@/context/PortfolioContext';
import { Category, MediaType, StudioSettings, CinemaPackage, TeamMember } from '@/types';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const { 
    projects, 
    mediaItems, 
    settings, 
    packages, 
    teamMembers,
    addProject, 
    addMediaItem, 
    deleteProject, 
    deleteMediaItem,
    updateSettings,
    addPackage,
    updatePackage,
    deletePackage,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember
  } = usePortfolio();

  const [authChecked, setAuthChecked] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Settings State
  const [settingsForm, setSettingsForm] = useState<StudioSettings>({
    email: '',
    phone: '',
    address: '',
    studioDescription: '',
    workspaceDescription: ''
  });

  // Package CRUD Form State
  const [packageForm, setPackageForm] = useState({
    id: '', // Empty means creating new
    title: '',
    description: '',
    inclusionsInput: '' // Newline separated
  });

  // Team CRUD Form State
  const [teamForm, setTeamForm] = useState({
    id: '',
    name: '',
    role: '',
    bio: '',
    initials: ''
  });

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    title: '',
    coverImageUrl: '',
    date: '',
    location: '',
    description: ''
  });

  // Media Form State
  const [mediaForm, setMediaForm] = useState({
    projectId: '',
    category: 'wedding' as Category,
    type: 'photo' as MediaType,
    url: '',
    title: ''
  });

  useEffect(() => {
    const auth = sessionStorage.getItem('filmox_authenticated');
    if (auth !== 'true') {
      router.push('/admin/login');
    } else {
      setAuthChecked(true);
      setUserRole(sessionStorage.getItem('filmox_user_role') || 'viewer');
      setUserId(sessionStorage.getItem('filmox_user_id') || '');
    }
  }, [router]);

  // Load current settings into form once initialized
  useEffect(() => {
    if (settings) {
      setSettingsForm({ ...settings });
    }
  }, [settings]);

  // Set default project ID in media form when projects load
  useEffect(() => {
    if (projects.length > 0 && !mediaForm.projectId) {
      setMediaForm(prev => ({ ...prev, projectId: projects[0].id }));
    }
  }, [projects, mediaForm.projectId]);

  const isAdmin = userRole === 'admin';

  const handleLogout = () => {
    sessionStorage.removeItem('filmox_authenticated');
    sessionStorage.removeItem('filmox_user_id');
    sessionStorage.removeItem('filmox_user_role');
    router.push('/admin/login');
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProj = addProject(
      projectForm.title,
      projectForm.coverImageUrl,
      projectForm.date,
      projectForm.location,
      projectForm.description
    );
    
    setMediaForm(prev => ({ ...prev, projectId: newProj.id }));
    setProjectForm({ title: '', coverImageUrl: '', date: '', location: '', description: '' });
    triggerSuccess('Project created successfully!');
  };

  const handleMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaForm.projectId) {
      alert('Please select or create a project first.');
      return;
    }
    
    addMediaItem(
      mediaForm.projectId,
      mediaForm.category,
      mediaForm.type,
      mediaForm.url,
      mediaForm.title
    );

    setMediaForm(prev => ({ ...prev, url: '', title: '' }));
    triggerSuccess('Media item uploaded and categorized successfully!');
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    triggerSuccess('Studio profile settings updated successfully!');
  };

  const handlePackageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inclusionsArray = packageForm.inclusionsInput
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    if (packageForm.id) {
      updatePackage(packageForm.id, packageForm.title, packageForm.description, inclusionsArray);
      triggerSuccess('Service package updated successfully!');
    } else {
      addPackage(packageForm.title, packageForm.description, inclusionsArray);
      triggerSuccess('New service package added successfully!');
    }

    setPackageForm({ id: '', title: '', description: '', inclusionsInput: '' });
  };

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamForm.id) {
      updateTeamMember(teamForm.id, teamForm.name, teamForm.role, teamForm.bio, teamForm.initials);
      triggerSuccess(`Team member "${teamForm.name}" updated!`);
    } else {
      addTeamMember(teamForm.name, teamForm.role, teamForm.bio, teamForm.initials);
      triggerSuccess(`Team member "${teamForm.name}" added!`);
    }
    setTeamForm({ id: '', name: '', role: '', bio: '', initials: '' });
  };

  const loadPackageForEditing = (pkg: CinemaPackage) => {
    setPackageForm({
      id: pkg.id,
      title: pkg.title,
      description: pkg.description,
      inclusionsInput: pkg.inclusions.join('\n')
    });
    setActiveTab('packages');
    triggerSuccess(`Loaded "${pkg.title}" for editing.`);
  };

  const loadTeamForEditing = (member: TeamMember) => {
    setTeamForm({
      id: member.id,
      name: member.name,
      role: member.role,
      bio: member.bio,
      initials: member.initials
    });
    setActiveTab('team');
    triggerSuccess(`Loaded "${member.name}" for editing.`);
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  if (!authChecked) {
    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          <div className={styles.loadingSpinner}>
            <div className={styles.spinnerRing}></div>
            <p>Authenticating Portal...</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '◈' },
    ...(isAdmin ? [
      { id: 'settings', label: 'Settings', icon: '⚙' },
      { id: 'packages', label: 'Packages', icon: '❒' },
      { id: 'team', label: 'Team', icon: '◎' },
      { id: 'portfolio', label: 'Portfolio', icon: '▣' },
      { id: 'media', label: 'Media', icon: '◬' },
    ] : [])
  ];

  return (
    <div className={styles.container}>
      <header className={styles.dashboardHeader}>
        <div>
          <h1>Dashboard</h1>
          <div className={styles.headerMeta}>
            <span className={styles.welcomeText}>Welcome, {userId}</span>
            <span className={`${styles.rolePill} ${isAdmin ? styles.rolePillAdmin : styles.rolePillViewer}`}>
              {isAdmin ? '✦ Admin' : '◈ Viewer'}
            </span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Link href="/" className={styles.viewSiteLink}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View Site
          </Link>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>

      {successMessage && (
        <div className={styles.successMsg}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Tab Navigation */}
      <div className={styles.tabBar}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className={styles.overviewGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{projects.length}</div>
            <div className={styles.statLabel}>Projects</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{mediaItems.length}</div>
            <div className={styles.statLabel}>Media Files</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{packages.length}</div>
            <div className={styles.statLabel}>Packages</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{teamMembers.length}</div>
            <div className={styles.statLabel}>Team Members</div>
          </div>

          {!isAdmin && (
            <div className={styles.viewerNotice}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <div>
                <strong>Viewer Access</strong>
                <p>You can view dashboard data but cannot make changes. Contact an admin to request edit access.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab (Admin Only) */}
      {activeTab === 'settings' && isAdmin && (
        <div className={styles.tabContent}>
          <div className={styles.panel}>
            <h2>Studio Settings</h2>
            <form onSubmit={handleSettingsSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="s_email">Contact Email</label>
                  <input
                    type="email" id="s_email" required className={styles.input}
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="s_phone">Contact Phone</label>
                  <input
                    type="text" id="s_phone" required className={styles.input}
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="s_address">Studio Location Address</label>
                <input
                  type="text" id="s_address" required className={styles.input}
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="s_studiodesc">Studio Description</label>
                <textarea
                  id="s_studiodesc" required className={styles.textarea}
                  value={settingsForm.studioDescription}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, studioDescription: e.target.value }))}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="s_workspacedesc">Workspace Description</label>
                <textarea
                  id="s_workspacedesc" required className={styles.textarea}
                  value={settingsForm.workspaceDescription}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, workspaceDescription: e.target.value }))}
                />
              </div>
              <button type="submit" className={styles.submitBtn}>Save Settings</button>
            </form>
          </div>
        </div>
      )}

      {/* Packages Tab (Admin Only) */}
      {activeTab === 'packages' && isAdmin && (
        <div className={styles.tabContent}>
          <div className={styles.twoCol}>
            {/* Package Form */}
            <div className={styles.panel}>
              <h2>{packageForm.id ? 'Edit Package' : 'Create Package'}</h2>
              <form onSubmit={handlePackageSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="pkg_title">Package Title</label>
                  <input
                    type="text" id="pkg_title" required placeholder="E.g., Cinematic Pre-Wedding"
                    className={styles.input} value={packageForm.title}
                    onChange={(e) => setPackageForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="pkg_desc">Package Description</label>
                  <textarea
                    id="pkg_desc" required placeholder="E.g., A comprehensive service containing..."
                    className={styles.textarea} value={packageForm.description}
                    onChange={(e) => setPackageForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="pkg_inclusions">Inclusions (One per line)</label>
                  <textarea
                    id="pkg_inclusions" required placeholder="Enter each feature on a new line..."
                    className={styles.textarea} style={{ height: '120px' }}
                    value={packageForm.inclusionsInput}
                    onChange={(e) => setPackageForm(prev => ({ ...prev, inclusionsInput: e.target.value }))}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className={styles.submitBtn}>
                    {packageForm.id ? 'Update Package' : 'Add Package'}
                  </button>
                  {packageForm.id && (
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setPackageForm({ id: '', title: '', description: '', inclusionsInput: '' })}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Package List */}
            <div className={styles.panel}>
              <h2>All Packages ({packages.length})</h2>
              <div className={styles.manageList}>
                {packages.map(pkg => (
                  <div key={pkg.id} className={styles.listItem}>
                    <div className={styles.listItemContent}>
                      <h3>{pkg.title}</h3>
                      <p>{pkg.description}</p>
                      <div className={styles.inclusionTags}>
                        {pkg.inclusions.slice(0, 3).map((inc, i) => (
                          <span key={i} className={styles.tag}>✓ {inc}</span>
                        ))}
                        {pkg.inclusions.length > 3 && (
                          <span className={styles.tagMore}>+{pkg.inclusions.length - 3} more</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.listItemActions}>
                      <button className={styles.editBtn} onClick={() => loadPackageForEditing(pkg)}>Edit</button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => {
                          if (confirm(`Delete package "${pkg.title}"?`)) deletePackage(pkg.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Tab (Admin Only) */}
      {activeTab === 'team' && isAdmin && (
        <div className={styles.tabContent}>
          <div className={styles.twoCol}>
            {/* Team Form */}
            <div className={styles.panel}>
              <h2>{teamForm.id ? 'Edit Member' : 'Add Team Member'}</h2>
              <form onSubmit={handleTeamSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="tm_name">Full Name</label>
                    <input
                      type="text" id="tm_name" required placeholder="E.g., Abhishek Sen"
                      className={styles.input} value={teamForm.name}
                      onChange={(e) => setTeamForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="tm_initials">Initials</label>
                    <input
                      type="text" id="tm_initials" required placeholder="E.g., AS" maxLength={3}
                      className={styles.input} value={teamForm.initials}
                      onChange={(e) => setTeamForm(prev => ({ ...prev, initials: e.target.value.toUpperCase() }))}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="tm_role">Role / Title</label>
                  <input
                    type="text" id="tm_role" required placeholder="E.g., Lead Cinematographer"
                    className={styles.input} value={teamForm.role}
                    onChange={(e) => setTeamForm(prev => ({ ...prev, role: e.target.value }))}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="tm_bio">Bio</label>
                  <textarea
                    id="tm_bio" required placeholder="Short description about this team member..."
                    className={styles.textarea} value={teamForm.bio}
                    onChange={(e) => setTeamForm(prev => ({ ...prev, bio: e.target.value }))}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className={styles.submitBtn}>
                    {teamForm.id ? 'Update Member' : 'Add Member'}
                  </button>
                  {teamForm.id && (
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setTeamForm({ id: '', name: '', role: '', bio: '', initials: '' })}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Team List */}
            <div className={styles.panel}>
              <h2>Team ({teamMembers.length})</h2>
              <div className={styles.manageList}>
                {teamMembers.map(member => (
                  <div key={member.id} className={styles.listItem}>
                    <div className={styles.listItemContent} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div className={styles.memberAvatar}>{member.initials}</div>
                      <div>
                        <h3>{member.name}</h3>
                        <p style={{ color: 'var(--color-antique-gold)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{member.role}</p>
                        <p>{member.bio}</p>
                      </div>
                    </div>
                    <div className={styles.listItemActions}>
                      <button className={styles.editBtn} onClick={() => loadTeamForEditing(member)}>Edit</button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => {
                          if (confirm(`Remove "${member.name}" from the team?`)) deleteTeamMember(member.id);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                {teamMembers.length === 0 && (
                  <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>No team members yet. Add one to get started.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Tab (Admin Only) */}
      {activeTab === 'portfolio' && isAdmin && (
        <div className={styles.tabContent}>
          <div className={styles.twoCol}>
            {/* Create Project */}
            <div className={styles.panel}>
              <h2>Create Project</h2>
              <form onSubmit={handleProjectSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="p_title">Couple Name / Project Title</label>
                  <input
                    type="text" id="p_title" required placeholder="E.g., Rohan & Priya"
                    className={styles.input} value={projectForm.title}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="p_cover">Cover Image URL</label>
                  <input
                    type="url" id="p_cover" placeholder="https://images.unsplash.com/photo..."
                    className={styles.input} value={projectForm.coverImageUrl}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, coverImageUrl: e.target.value }))}
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="p_date">Event Date</label>
                    <input
                      type="date" id="p_date" required
                      className={styles.input} value={projectForm.date}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="p_location">Location</label>
                    <input
                      type="text" id="p_location" required placeholder="E.g., Udaipur Palace"
                      className={styles.input} value={projectForm.location}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="p_desc">Description</label>
                  <textarea
                    id="p_desc" placeholder="Brief description about the wedding theme..."
                    className={styles.textarea} value={projectForm.description}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <button type="submit" className={styles.submitBtn}>Create Project</button>
              </form>
            </div>

            {/* Manage Portfolio */}
            <div className={styles.panel}>
              <h2>Projects ({projects.length})</h2>
              <div className={styles.manageList}>
                {projects.length > 0 ? (
                  projects.map((project) => {
                    const innerMedia = mediaItems.filter(m => m.projectId === project.id);
                    return (
                      <div key={project.id} className={styles.listItem}>
                        <div className={styles.listItemContent}>
                          <h3>{project.title}</h3>
                          <p style={{ fontSize: '0.8rem' }}>{project.location} • {project.date}</p>
                          <span className={styles.tagMore}>{innerMedia.length} media files</span>
                        </div>
                        <div className={styles.listItemActions}>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => {
                              if (confirm(`Delete "${project.title}" and all its photos/videos?`)) {
                                deleteProject(project.id);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ opacity: 0.5 }}>No projects available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Tab (Admin Only) */}
      {activeTab === 'media' && isAdmin && (
        <div className={styles.tabContent}>
          <div className={styles.twoCol}>
            {/* Add Media */}
            <div className={styles.panel}>
              <h2>Upload Media</h2>
              <form onSubmit={handleMediaSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="m_project">Select Project</label>
                  <select
                    id="m_project" required className={styles.select}
                    value={mediaForm.projectId}
                    onChange={(e) => setMediaForm(prev => ({ ...prev, projectId: e.target.value }))}
                  >
                    <option value="">-- Choose Project --</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="m_category">Category</label>
                    <select
                      id="m_category" required className={styles.select}
                      value={mediaForm.category}
                      onChange={(e) => setMediaForm(prev => ({ ...prev, category: e.target.value as Category }))}
                    >
                      <option value="wedding">Wedding</option>
                      <option value="pre-wedding">Pre-Wedding</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="m_type">Type</label>
                    <select
                      id="m_type" required className={styles.select}
                      value={mediaForm.type}
                      onChange={(e) => setMediaForm(prev => ({ ...prev, type: e.target.value as MediaType }))}
                    >
                      <option value="photo">Photo</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="m_title">Media Title</label>
                  <input
                    type="text" id="m_title" placeholder="E.g., Bride Entrance"
                    className={styles.input} value={mediaForm.title}
                    onChange={(e) => setMediaForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="m_url">Asset URL / Embed Link</label>
                  <input
                    type="text" id="m_url" required
                    placeholder={mediaForm.type === 'photo' ? 'Image URL' : 'YouTube link'}
                    className={styles.input} value={mediaForm.url}
                    onChange={(e) => setMediaForm(prev => ({ ...prev, url: e.target.value }))}
                  />
                </div>
                <button type="submit" className={styles.submitBtn}>Upload Content</button>
              </form>
            </div>

            {/* Media List */}
            <div className={styles.panel}>
              <h2>All Media ({mediaItems.length})</h2>
              <div className={styles.manageList}>
                {mediaItems.length > 0 ? (
                  <table className={styles.mediaTable}>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Project</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th style={{ width: '40px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mediaItems.map((m) => {
                        const project = projects.find(p => p.id === m.projectId);
                        return (
                          <tr key={m.id}>
                            <td className={styles.mediaTitle}>{m.title || 'Untitled'}</td>
                            <td style={{ fontSize: '0.8rem', opacity: 0.7 }}>{project?.title || m.projectId}</td>
                            <td style={{ textTransform: 'capitalize' }}>{m.category}</td>
                            <td>
                              <span className={styles.mediaTypeBadge}>{m.type}</span>
                            </td>
                            <td>
                              <button
                                className={styles.miniDeleteBtn}
                                title="Delete file"
                                onClick={() => {
                                  if (confirm('Delete this media item?')) deleteMediaItem(m.id);
                                }}
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ opacity: 0.5 }}>No media uploaded yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
