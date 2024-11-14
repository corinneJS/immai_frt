import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { validateRegistration, validateLogin } from '../validators/auth.validator.js';
import logger from '../utils/logger.js';

export const register = async (req, res) => {
  try {
    // Validation des données
    await validateRegistration(req.body);

    const { email, password, name } = req.body;

    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Tentative d'inscription avec un email existant: ${email}`);
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Création du nouvel utilisateur
    const user = new User({
      email,
      password, // Le hash est géré par le middleware pre-save
      name,
      profile: {
        avatar: '',
        language: 'fr',
        notifications: true
      }
    });

    await user.save();
    logger.info(`Nouvel utilisateur créé: ${email}`);

    // Génération du token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Réponse sans le mot de passe
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      profile: user.profile
    };

    res.status(201).json({
      token,
      user: userResponse
    });
  } catch (error) {
    logger.error('Erreur lors de l\'inscription:', error);
    res.status(400).json({ 
      message: error.message || 'Erreur lors de l\'inscription' 
    });
  }
};

export const login = async (req, res) => {
  try {
    // Validation des données
    await validateLogin(req.body);

    const { email, password } = req.body;

    // Recherche de l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Tentative de connexion avec un email inexistant: ${email}`);
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérification du mot de passe
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      logger.warn(`Tentative de connexion avec un mot de passe incorrect pour: ${email}`);
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Génération du token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info(`Connexion réussie pour: ${email}`);

    // Réponse sans le mot de passe
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      profile: user.profile
    };

    res.json({
      token,
      user: userResponse
    });
  } catch (error) {
    logger.error('Erreur lors de la connexion:', error);
    res.status(400).json({ 
      message: error.message || 'Erreur lors de la connexion' 
    });
  }
};