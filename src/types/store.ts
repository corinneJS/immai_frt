export interface User {
  id: string;
  email: string;
  name: string;
  profile: {
    avatar?: string;
    language: 'fr' | 'en';
    notifications: boolean;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

export interface Exercise {
  id: number;
  title: string;
  description: string;
  type: 'meditation' | 'breathing' | 'journal';
  duration: number;
  completed: boolean;
}

export interface ExerciseState {
  exercises: Exercise[];
  currentExercise: Exercise | null;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  chat: ChatState;
  exercise: ExerciseState;
}