export interface Project {
  id: string;
  title: string;
  coverImageUrl: string;
  date: string;
  location: string;
  description?: string;
}

export type Category = 'wedding' | 'pre-wedding';
export type MediaType = 'photo' | 'video';

export interface MediaItem {
  id: string;
  projectId: string;
  category: Category;
  type: MediaType;
  url: string; // Image source URL or YouTube/Vimeo embed/watch URL
  title?: string;
}

export interface StudioSettings {
  email: string;
  phone: string;
  address: string;
  studioDescription: string;
  workspaceDescription: string;
}

export interface CinemaPackage {
  id: string;
  title: string;
  description: string;
  inclusions: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
}
