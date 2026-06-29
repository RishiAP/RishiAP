export interface Project {
    id: number;
    name: string;
    description: string;
    html_url: string;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    full_name: string;
    languages?: LanguageUsage[];
  }
  
export interface LanguageUsage {
    language: string;
    percentage: number;
  }