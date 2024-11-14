import Exercise from '../models/exercise.model.js';
import logger from '../utils/logger.js';

// Récupérer tous les exercices d'un utilisateur
export const getUserExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({ user: req.user._id });
    res.json(exercises);
  } catch (error) {
    logger.error('Erreur lors de la récupération des exercices:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer un nouvel exercice
export const createExercise = async (req, res) => {
  try {
    const { title, description, type, duration, content } = req.body;
    
    const exercise = new Exercise({
      title,
      description,
      type,
      duration,
      content,
      user: req.user._id
    });

    await exercise.save();
    res.status(201).json(exercise);
  } catch (error) {
    logger.error('Erreur lors de la création de l\'exercice:', error);
    res.status(400).json({ message: error.message });
  }
};

// Marquer un exercice comme terminé
export const completeExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!exercise) {
      return res.status(404).json({ message: 'Exercice non trouvé' });
    }

    exercise.completed = true;
    exercise.completedAt = new Date();
    await exercise.save();

    res.json(exercise);
  } catch (error) {
    logger.error('Erreur lors de la mise à jour de l\'exercice:', error);
    res.status(400).json({ message: error.message });
  }
};