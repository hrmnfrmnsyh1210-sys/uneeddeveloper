export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

export interface Project {
  id: string;
  title: string;
  category: 'Web App' | 'Mobile App' | 'Reporting';
  imageUrl: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ContactFormState {
  name: string;
  email: string;
  service: string;
  message: string;
}
