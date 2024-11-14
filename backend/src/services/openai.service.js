import OpenAI from 'openai';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

// Charger les variables d'environnement
dotenv.config();

// Vérifier que la clé API est présente
if (!process.env.OPENAI_API_KEY) {
  logger.error('La clé API OpenAI n\'est pas définie dans les variables d\'environnement');
  throw new Error('La clé API OpenAI est requise');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Analyse du sentiment d'un message
export const analyzeMessage = async (content) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Analyse le sentiment du message suivant et réponds uniquement par 'positive', 'negative' ou 'neutral'."
        },
        {
          role: "user",
          content
        }
      ],
      temperature: 0.3,
      max_tokens: 10
    });

    return completion.choices[0].message.content.toLowerCase();
  } catch (error) {
    logger.error('Erreur lors de l\'analyse du sentiment:', error);
    return 'neutral';
  }
};

// Génération de la réponse AI
export const generateResponse = async (content) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Tu es un assistant thérapeutique bienveillant et empathique qui aide les utilisateurs à gérer leur santé mentale. 
                   Réponds toujours en français de manière empathique et constructive.`
        },
        {
          role: "user",
          content
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0].message.content;
  } catch (error) {
    logger.error('Erreur lors de la génération de la réponse:', error);
    throw new Error('Impossible de générer une réponse pour le moment.');
  }
};