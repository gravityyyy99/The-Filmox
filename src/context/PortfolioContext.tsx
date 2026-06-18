'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, MediaItem, Category, MediaType, StudioSettings, CinemaPackage, TeamMember } from '../types';

interface PortfolioContextProps {
  projects: Project[];
  mediaItems: MediaItem[];
  settings: StudioSettings;
  packages: CinemaPackage[];
  teamMembers: TeamMember[];
  addProject: (title: string, coverImageUrl: string, date: string, location: string, description?: string) => Project;
  addMediaItem: (projectId: string, category: Category, type: MediaType, url: string, title?: string) => MediaItem;
  deleteProject: (id: string) => void;
  deleteMediaItem: (id: string) => void;
  updateSettings: (newSettings: StudioSettings) => void;
  addPackage: (title: string, description: string, inclusions: string[]) => CinemaPackage;
  updatePackage: (id: string, title: string, description: string, inclusions: string[]) => void;
  deletePackage: (id: string) => void;
  addTeamMember: (name: string, role: string, bio: string, initials: string) => TeamMember;
  updateTeamMember: (id: string, name: string, role: string, bio: string, initials: string) => void;
  deleteTeamMember: (id: string) => void;
}

const PortfolioContext = createContext<PortfolioContextProps | undefined>(undefined);

// Premium curated mock images from Unsplash (Wedding & Pre-wedding)
const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'rohan-priya',
    title: 'Rohan & Priya',
    coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    date: '2026-02-14',
    location: 'Udaipur Palace, Rajasthan',
    description: 'A royal heritage wedding captured under the golden skies of Udaipur, showcasing grand architecture, vibrant colors, and emotional moments.'
  },
  {
    id: 'kabir-kiara',
    title: 'Kabir & Kiara',
    coverImageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
    date: '2026-01-20',
    location: 'Goa Coastline & Beach',
    description: 'An intimate sunset pre-wedding shoot along the sandy beaches of Goa, blending raw emotions with the relaxing ocean waves.'
  },
  {
    id: 'dev-meera',
    title: 'Dev & Meera',
    coverImageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop',
    date: '2025-12-05',
    location: 'Rishikesh Foothills',
    description: 'A serene and spiritual wedding by the banks of the Ganges, highlighting traditional rituals and beautiful landscape backdrops.'
  }
];

const DEFAULT_MEDIA: MediaItem[] = [
  // Rohan & Priya - Wedding - Photos
  {
    id: 'rp-photo-1',
    projectId: 'rohan-priya',
    category: 'wedding',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    title: 'The Royal Entrance'
  },
  {
    id: 'rp-photo-2',
    projectId: 'rohan-priya',
    category: 'wedding',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
    title: 'Vows by the Sacred Fire'
  },
  {
    id: 'rp-photo-3',
    projectId: 'rohan-priya',
    category: 'wedding',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=800&auto=format&fit=crop',
    title: 'Bride Portrait'
  },
  // Rohan & Priya - Wedding - Videos
  {
    id: 'rp-video-1',
    projectId: 'rohan-priya',
    category: 'wedding',
    type: 'video',
    url: 'https://www.youtube.com/embed/5qap5aO4i9A',
    title: 'Main Wedding Film Teaser'
  },
  {
    id: 'rp-video-2',
    projectId: 'rohan-priya',
    category: 'wedding',
    type: 'video',
    url: 'https://www.youtube.com/embed/A83P2w2p5lM',
    title: 'Varmala Highlight'
  },
  // Rohan & Priya - Pre-Wedding - Photos
  {
    id: 'rp-pw-photo-1',
    projectId: 'rohan-priya',
    category: 'pre-wedding',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
    title: 'Lakeside Reflections'
  },
  {
    id: 'rp-pw-photo-2',
    projectId: 'rohan-priya',
    category: 'pre-wedding',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop',
    title: 'Walking into Forever'
  },
  // Rohan & Priya - Pre-Wedding - Videos
  {
    id: 'rp-pw-video-1',
    projectId: 'rohan-priya',
    category: 'pre-wedding',
    type: 'video',
    url: 'https://www.youtube.com/embed/O4i9A-A83P2',
    title: 'Udaipur Pre-Wedding Story'
  },
  // Kabir & Kiara - Pre-Wedding - Photos
  {
    id: 'kk-pw-photo-1',
    projectId: 'kabir-kiara',
    category: 'pre-wedding',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    title: 'Sunset Shoreline Walk'
  },
  {
    id: 'kk-pw-photo-2',
    projectId: 'kabir-kiara',
    category: 'pre-wedding',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop',
    title: 'A Gaze of Love'
  },
  // Kabir & Kiara - Pre-Wedding - Videos
  {
    id: 'kk-pw-video-1',
    projectId: 'kabir-kiara',
    category: 'pre-wedding',
    type: 'video',
    url: 'https://www.youtube.com/embed/5qap5aO4i9A',
    title: 'Goa Shoreline Romance'
  },
  // Dev & Meera - Wedding - Photos
  {
    id: 'dm-photo-1',
    projectId: 'dev-meera',
    category: 'wedding',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop',
    title: 'Sacred Rituals'
  },
  {
    id: 'dm-photo-2',
    projectId: 'dev-meera',
    category: 'wedding',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1595152230535-09a2707f88c2?q=80&w=800&auto=format&fit=crop',
    title: 'Happy Tears'
  },
  // Dev & Meera - Wedding - Videos
  {
    id: 'dm-video-1',
    projectId: 'dev-meera',
    category: 'wedding',
    type: 'video',
    url: 'https://www.youtube.com/embed/A83P2w2p5lM',
    title: 'Rishikesh Wedding Film'
  }
];

const DEFAULT_SETTINGS: StudioSettings = {
  email: 'hello@thefilmox.com',
  phone: '+91 98765 43210',
  address: '402, Elite Creative Plaza, Link Road, Andheri West, Mumbai, Maharashtra - 400053, India',
  studioDescription: 'Based in the creative hub of Mumbai, our studio is designed to encourage storytelling, color, and cinematic sound design. It acts as both a workshop for our craft and a comfortable space to collaborate with our clients.',
  workspaceDescription: 'Our creative workspace is configured with ultra-wide grading bays, dynamic workspaces, and an equipment arsenal display.'
};

const DEFAULT_PACKAGES: CinemaPackage[] = [
  {
    id: 'pre-wedding',
    title: 'Pre-Wedding Film',
    description: 'A cinematic journey documenting your love chemistry before the main wedding celebrations.',
    inclusions: [
      '1 Day shooting in curated locations',
      '2 Cinematographers with Cinema gears',
      'Drone/Aerial cinematic shots',
      '1 Cinematic pre-wedding film (3-4 mins)',
      'Private online download gallery',
      'Consultation and location assistance'
    ]
  },
  {
    id: 'wedding-cinema',
    title: 'Wedding Cinema',
    description: 'Immersive multi-day cinematic capture of your traditional ceremonies, vows, and visual emotions.',
    inclusions: [
      '3 Days of full wedding coverage',
      '3 Cinematographers + Director',
      'High-end 4K cinema cameras',
      '1 Cinematic wedding film (5-7 mins)',
      'Full length traditional video document',
      'Same-day edit teaser (60 secs)'
    ]
  },
  {
    id: 'complete-love-story',
    title: 'Complete Love Story',
    description: 'Our ultimate combination package covering pre-wedding highlights and the grand marriage saga.',
    inclusions: [
      'Pre-Wedding Shoot (1 Day) + Wedding (3 Days)',
      'Complete Crew (4 Cinematographers)',
      'Drone, Crane & stabilizers setup',
      'Pre-wedding film + Wedding film (8-10 mins)',
      'Same-day teaser & reels package (3 clips)',
      'Premium box-packed archival drive'
    ]
  }
];

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: 'abhishek-sen',
    name: 'Abhishek Sen',
    role: 'Founder & Lead Cinematographer',
    bio: 'Abhishek has over a decade of experience in cinema and storytelling. His eye for detail and passion for frames turn weddings into cinematic masterpieces.',
    initials: 'AS'
  },
  {
    id: 'rohit-sharma',
    name: 'Rohit Sharma',
    role: 'Director of Photography',
    bio: 'With an exceptional understanding of lighting and compositions, Rohit ensures that every emotional exchange is captured with cinematic finesses.',
    initials: 'RS'
  },
  {
    id: 'meera-patel',
    name: 'Meera Patel',
    role: 'Creative Director & Chief Editor',
    bio: 'Meera brings soul to the captured frames. Her editing style is defined by rhythm, emotion, and seamless soundscapes.',
    initials: 'MP'
  },
  {
    id: 'kiara-advani',
    name: 'Kiara Advani',
    role: 'Senior Colorist & Visual Stylist',
    bio: 'Kiara shapes the visual mood and palette of every Filmox production, crafting rich cinematic tones that feel deep, elegant, and timeless.',
    initials: 'KA'
  },
  {
    id: 'devansh-verma',
    name: 'Devansh Verma',
    role: 'Lead Drone Pilot & Sound Designer',
    bio: 'Devansh captures breath-taking aerial perspectives and synthesizes immersive ambient soundscapes that elevate standard frames into emotional milestones.',
    initials: 'DV'
  }
];

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [settings, setSettings] = useState<StudioSettings>(DEFAULT_SETTINGS);
  const [packages, setPackages] = useState<CinemaPackage[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const storedProjects = localStorage.getItem('filmox_projects');
    const storedMedia = localStorage.getItem('filmox_media');
    const storedSettings = localStorage.getItem('filmox_settings');
    const storedPackages = localStorage.getItem('filmox_packages');
    const storedTeam = localStorage.getItem('filmox_team');

    if (storedProjects) setProjects(JSON.parse(storedProjects));
    else {
      setProjects(DEFAULT_PROJECTS);
      localStorage.setItem('filmox_projects', JSON.stringify(DEFAULT_PROJECTS));
    }

    if (storedMedia) setMediaItems(JSON.parse(storedMedia));
    else {
      setMediaItems(DEFAULT_MEDIA);
      localStorage.setItem('filmox_media', JSON.stringify(DEFAULT_MEDIA));
    }

    if (storedSettings) setSettings(JSON.parse(storedSettings));
    else {
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem('filmox_settings', JSON.stringify(DEFAULT_SETTINGS));
    }

    if (storedPackages) setPackages(JSON.parse(storedPackages));
    else {
      setPackages(DEFAULT_PACKAGES);
      localStorage.setItem('filmox_packages', JSON.stringify(DEFAULT_PACKAGES));
    }

    if (storedTeam) setTeamMembers(JSON.parse(storedTeam));
    else {
      setTeamMembers(DEFAULT_TEAM);
      localStorage.setItem('filmox_team', JSON.stringify(DEFAULT_TEAM));
    }

    setInitialized(true);
  }, []);

  const addProject = (title: string, coverImageUrl: string, date: string, location: string, description?: string) => {
    const newId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProject: Project = {
      id: newId,
      title,
      coverImageUrl: coverImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      date,
      location,
      description
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('filmox_projects', JSON.stringify(updatedProjects));
    return newProject;
  };

  const addMediaItem = (projectId: string, category: Category, type: MediaType, url: string, title?: string) => {
    let embedUrl = url;
    if (type === 'video' && url.includes('youtube.com/watch')) {
      try {
        const urlObj = new URL(url);
        const v = urlObj.searchParams.get('v');
        if (v) {
          embedUrl = `https://www.youtube.com/embed/${v}`;
        }
      } catch (e) {
        console.error('Invalid YouTube URL', e);
      }
    } else if (type === 'video' && url.includes('youtu.be/')) {
      try {
        const id = url.split('/').pop()?.split('?')[0];
        if (id) {
          embedUrl = `https://www.youtube.com/embed/${id}`;
        }
      } catch (e) {
        console.error('Invalid youtu.be URL', e);
      }
    }

    const newMedia: MediaItem = {
      id: `media-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      projectId,
      category,
      type,
      url: embedUrl,
      title
    };

    const updatedMedia = [...mediaItems, newMedia];
    setMediaItems(updatedMedia);
    localStorage.setItem('filmox_media', JSON.stringify(updatedMedia));
    return newMedia;
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    const updatedMedia = mediaItems.filter(m => m.projectId !== id);

    setProjects(updatedProjects);
    setMediaItems(updatedMedia);

    localStorage.setItem('filmox_projects', JSON.stringify(updatedProjects));
    localStorage.setItem('filmox_media', JSON.stringify(updatedMedia));
  };

  const deleteMediaItem = (id: string) => {
    const updatedMedia = mediaItems.filter(m => m.id !== id);
    setMediaItems(updatedMedia);
    localStorage.setItem('filmox_media', JSON.stringify(updatedMedia));
  };

  const updateSettings = (newSettings: StudioSettings) => {
    setSettings(newSettings);
    localStorage.setItem('filmox_settings', JSON.stringify(newSettings));
  };

  const addPackage = (title: string, description: string, inclusions: string[]) => {
    const newPkg: CinemaPackage = {
      id: `pkg-${Date.now()}`,
      title,
      description,
      inclusions
    };
    const updated = [...packages, newPkg];
    setPackages(updated);
    localStorage.setItem('filmox_packages', JSON.stringify(updated));
    return newPkg;
  };

  const updatePackage = (id: string, title: string, description: string, inclusions: string[]) => {
    const updated = packages.map(pkg => pkg.id === id ? { ...pkg, title, description, inclusions } : pkg);
    setPackages(updated);
    localStorage.setItem('filmox_packages', JSON.stringify(updated));
  };

  const deletePackage = (id: string) => {
    const updated = packages.filter(pkg => pkg.id !== id);
    setPackages(updated);
    localStorage.setItem('filmox_packages', JSON.stringify(updated));
  };

  const addTeamMember = (name: string, role: string, bio: string, initials: string) => {
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name,
      role,
      bio,
      initials
    };
    const updated = [...teamMembers, newMember];
    setTeamMembers(updated);
    localStorage.setItem('filmox_team', JSON.stringify(updated));
    return newMember;
  };

  const updateTeamMember = (id: string, name: string, role: string, bio: string, initials: string) => {
    const updated = teamMembers.map(member => member.id === id ? { ...member, name, role, bio, initials } : member);
    setTeamMembers(updated);
    localStorage.setItem('filmox_team', JSON.stringify(updated));
  };

  const deleteTeamMember = (id: string) => {
    const updated = teamMembers.filter(member => member.id !== id);
    setTeamMembers(updated);
    localStorage.setItem('filmox_team', JSON.stringify(updated));
  };

  if (!initialized) {
    return null;
  }

  return (
    <PortfolioContext.Provider value={{ 
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
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
