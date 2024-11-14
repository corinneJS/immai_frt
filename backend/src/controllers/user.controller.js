import User from '../models/user.model.js';
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

// Récupérer le profil de l'utilisateur
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('exercises');

    // Initialisation des statistiques par défaut
    const stats = {
      completedExercises: 0,
      chatSessions: 0,
      lastActive: user.updatedAt
    };

    // Calcul des exercices complétés
    if (user.exercises && user.exercises.length > 0) {
      stats.completedExercises = user.exercises.filter(ex => ex.completed).length;
    }

    // Calcul des sessions de chat
    stats.chatSessions = await getChatSessionsCount(user._id);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profile: user.profile
      },
      stats,
      preferences: {
        language: user.profile.language || 'fr',
        notifications: user.profile.notifications || false
      }
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour le profil de l'utilisateur
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Vérification des données
    if (!name && !email) {
      return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
    }

    const user = await User.findById(req.user._id);
    
    // Vérification de l'unicité de l'email
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }
    
    await user.save();

    // Retourner les données mises à jour
    res.json({ 
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profile: user.profile
      }
    });
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du profil:', error);
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour les paramètres de l'utilisateur
export const updateUserSettings = async (req, res) => {
  try {
    const { language, notifications } = req.body;
    
    // Vérification des données
    if (language && !['fr', 'en'].includes(language)) {
      return res.status(400).json({ message: 'Langue non supportée' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user.profile) {
      user.profile = {};
    }

    if (language) {
      user.profile.language = language;
    }

    if (typeof notifications === 'boolean') {
      user.profile.notifications = notifications;
    }
    
    await user.save();

    res.json({ 
      settings: {
        language: user.profile.language || 'fr',
        notifications: user.profile.notifications || false
      }
    });
  } catch (error) {
    logger.error('Erreur lors de la mise à jour des paramètres:', error);
    res.status(400).json({ message: error.message });
  }
};

// Fonction utilitaire pour compter les sessions de chat
const getChatSessionsCount = async (userId) => {
  try {
    const ChatMessage = mongoose.model('ChatMessage');
    const count = await ChatMessage.countDocuments({
      user: userId,
      isBot: false
    });
    return count;
  } catch (error) {
    logger.error('Erreur lors du comptage des sessions de chat:', error);
    return 0;
  }
};