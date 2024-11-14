import ChatMessage from '../models/chat.model.js';
import { analyzeMessage, generateResponse } from '../services/openai.service.js';
import logger from '../utils/logger.js';

// Récupérer l'historique des messages
export const getChatHistory = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ user: req.user._id })
      .sort({ createdAt: 'asc' })
      .limit(50);
    res.json(messages);
  } catch (error) {
    logger.error('Erreur lors de la récupération de l\'historique:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Envoyer un message et obtenir une réponse
export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ message: 'Le contenu du message est requis' });
    }

    // Sauvegarde du message utilisateur
    const userMessage = new ChatMessage({
      user: req.user._id,
      content,
      isBot: false,
      sentiment: 'neutral' // On met une valeur par défaut
    });
    await userMessage.save();

    try {
      // Analyse du sentiment en arrière-plan
      analyzeMessage(content).then(async (sentiment) => {
        userMessage.sentiment = sentiment;
        await userMessage.save();
      });

      // Génération de la réponse AI
      const aiResponse = await generateResponse(content);

      // Sauvegarde de la réponse AI
      const botMessage = new ChatMessage({
        user: req.user._id,
        content: aiResponse,
        isBot: true,
        sentiment: 'neutral'
      });
      await botMessage.save();

      res.json({
        userMessage,
        botMessage
      });
    } catch (aiError) {
      logger.error('Erreur avec OpenAI:', aiError);
      
      // Message de repli si OpenAI échoue
      const botMessage = new ChatMessage({
        user: req.user._id,
        content: "Je suis désolé, je rencontre des difficultés techniques. Pouvez-vous reformuler votre message ?",
        isBot: true,
        sentiment: 'neutral'
      });
      await botMessage.save();

      res.json({
        userMessage,
        botMessage
      });
    }
  } catch (error) {
    logger.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({ message: 'Erreur lors du traitement de votre message' });
  }
};