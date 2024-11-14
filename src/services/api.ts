import { OPENAI_API_KEY } from '@env';

// Modification de l'URL de l'API pour utiliser l'IP locale au lieu de localhost
const API_URL = 'http://0.0.0.0:3000/api';

// Service d'authentification
export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur login:', error);
      throw error;
    }
  },

  async register(name: string, email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur register:', error);
      throw error;
    }
  },
};

// Service de chat
export const chatService = {
  async getHistory() {
    try {
      const response = await fetch(`${API_URL}/chat/history`, {
        headers: await getHeaders(),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération de l\'historique');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur get history:', error);
      throw error;
    }
  },

  async sendMessage(content: string) {
    try {
      const response = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify({ content }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'envoi du message');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur send message:', error);
      throw error;
    }
  },
};

// Service utilisateur
export const userService = {
  async getProfile() {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: await getHeaders(),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération du profil');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur get profile:', error);
      throw error;
    }
  },

  async updateProfile(profileData: { name?: string; email?: string }) {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PATCH',
        headers: await getHeaders(),
        body: JSON.stringify(profileData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour du profil');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur update profile:', error);
      throw error;
    }
  },

  async updateSettings(settings: { language?: 'fr' | 'en'; notifications?: boolean }) {
    try {
      const response = await fetch(`${API_URL}/users/settings`, {
        method: 'PATCH',
        headers: await getHeaders(),
        body: JSON.stringify(settings),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour des paramètres');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur update settings:', error);
      throw error;
    }
  },
};

// Service de méditation
export const meditationService = {
  async getAllMeditations() {
    try {
      const response = await fetch(`${API_URL}/meditations`, {
        headers: await getHeaders(),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des méditations');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur get meditations:', error);
      throw error;
    }
  },

  async getMeditationById(id: string) {
    try {
      const response = await fetch(`${API_URL}/meditations/${id}`, {
        headers: await getHeaders(),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération de la méditation');
      }
      
      return data;
    } catch (error) {
      console.error('Erreur get meditation:', error);
      throw error;
    }
  },
};

// Fonction utilitaire pour obtenir les headers avec le token
const getHeaders = async () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = await getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Fonction utilitaire pour obtenir le token
const getToken = async () => {
  // Implémenter la récupération du token depuis le stockage local
  return null;
};

export const generateAIResponse = async (message: string) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant thérapeutique bienveillant et empathique qui aide les utilisateurs à gérer leur santé mentale.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Erreur lors de l\'appel à OpenAI:', error);
    throw new Error('Impossible de générer une réponse pour le moment.');
  }
};