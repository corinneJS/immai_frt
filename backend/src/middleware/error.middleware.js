import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  // Log de l'erreur
  logger.error('Erreur globale:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Gestion des erreurs de validation Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Erreur de validation',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Gestion des erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token invalide'
    });
  }

  // Gestion des erreurs de token expiré
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expiré'
    });
  }

  // Gestion des erreurs de duplication MongoDB
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Cette valeur existe déjà'
    });
  }

  // Erreur par défaut
  res.status(err.status || 500).json({
    message: err.message || 'Erreur serveur interne'
  });
};