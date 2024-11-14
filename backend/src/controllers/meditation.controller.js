import Meditation from '../models/meditation.model.js';
import logger from '../utils/logger.js';

// Récupérer toutes les méditations
export const getAllMeditations = async (req, res) => {
  try {
    const meditations = await Meditation.find()
      .select('title description category color duration');
    res.json(meditations);
  } catch (error) {
    logger.error('Erreur lors de la récupération des méditations:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer une méditation par son ID
export const getMeditationById = async (req, res) => {
  try {
    const meditation = await Meditation.findById(req.params.id);
    if (!meditation) {
      return res.status(404).json({ message: 'Méditation non trouvée' });
    }
    res.json(meditation);
  } catch (error) {
    logger.error('Erreur lors de la récupération de la méditation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Initialiser les méditations de base
export const initializeMeditations = async () => {
  try {
    const count = await Meditation.countDocuments();
    if (count === 0) {
      const initialMeditations = [
        {
          title: 'Méditation de Pleine Conscience pour le Stress',
          objective: 'Réduire le stress en se concentrant sur le moment présent',
          description: 'Diminue le stress en favorisant la pleine conscience',
          category: 'Pleine Conscience',
          color: '#8EC5FC',
          script: "Installez-vous confortablement, le dos droit, les pieds posés à plat sur le sol. Fermez doucement les yeux et portez votre attention sur votre respiration. Sentez l'air entrer par vos narines, remplir vos poumons, puis ressortir doucement. Observez le rythme naturel de votre respiration sans chercher à le modifier. Si des pensées surgissent, observez-les sans jugement et ramenez doucement votre attention à votre respiration. Continuez ainsi pendant quelques minutes, en vous ancrant dans le moment présent. Ensuite, élargissez votre attention aux sensations corporelles, en commençant par le sommet de votre tête et en descendant progressivement jusqu'aux pieds. Notez les zones de tension ou de confort, sans chercher à les changer. Terminez en prenant conscience de l'environnement sonore autour de vous, en accueillant chaque son comme il vient, sans jugement.",
          duration: 900,
          audioUrl: "https://storage.googleapis.com/inmymindai/meditations/pleine-conscience-stress.mp3",
          fractalParams: {
            type: "mandelbrot",
            zoom: "1.5",
            colorScheme: "blue",
            speed: "0.5"
          }
        },
        {
          title: 'Balayage Corporel pour la Gestion de la Douleur',
          objective: 'Atténuer la perception de la douleur en prenant conscience des sensations corporelles',
          description: 'Soulage la douleur par un balayage de relaxation musculaire',
          category: 'Gestion de la Douleur',
          color: '#F0A6CA',
          script: "Allongez-vous confortablement sur le dos, les bras le long du corps. Fermez les yeux et prenez quelques respirations profondes. Commencez par porter votre attention sur vos orteils, ressentez les sensations présentes, puis remontez progressivement vers vos pieds, vos chevilles, vos mollets, en continuant ainsi jusqu'au sommet de votre tête. À chaque étape, notez les sensations sans jugement et relâchez les tensions que vous pourriez percevoir. Si vous ressentez de la douleur, observez-la sans essayer de la modifier, en notant sa localisation, son intensité et sa nature. Continuez ce balayage corporel, en accordant à chaque partie du corps le temps nécessaire pour l'explorer pleinement. Terminez en prenant quelques respirations profondes, en ressentant une détente globale dans tout votre corps.",
          duration: 1200,
          audioUrl: "https://storage.googleapis.com/inmymindai/meditations/balayage-corporel.mp3",
          fractalParams: {
            type: "julia",
            zoom: "2.0",
            colorScheme: "pink",
            speed: "0.3"
          }
        },
        {
          title: 'Visualisation Apaisante pour Améliorer le Sommeil',
          objective: 'Faciliter l'endormissement par la création d'images mentales apaisantes',
          description: 'Favorise le sommeil par une visualisation relaxante',
          category: 'Relaxation / Sommeil',
          color: '#B8E986',
          script: "Allongez-vous dans votre lit, les yeux fermés. Prenez quelques respirations profondes pour vous détendre. Imaginez-vous dans un lieu paisible, peut-être une plage au coucher du soleil ou une forêt tranquille. Ressentez la brise douce, écoutez les sons apaisants de la nature. Laissez cette scène vous envelopper, apportant calme et sérénité. Si des pensées distrayantes apparaissent, laissez-les passer comme des nuages dans le ciel, revenant toujours à votre lieu de paix. Explorez ce lieu en détail, en notant les couleurs, les sons, les odeurs et les sensations. Permettez à votre corps de se détendre de plus en plus profondément à mesure que vous vous immergez dans cette visualisation. Terminez en vous sentant prêt à glisser doucement dans un sommeil réparateur.",
          duration: 1500,
          audioUrl: "https://storage.googleapis.com/inmymindai/meditations/visualisation-sommeil.mp3",
          fractalParams: {
            type: "spiral",
            zoom: "1.8",
            colorScheme: "green",
            speed: "0.2"
          }
        },
        {
          title: 'Amour Bienveillant pour Cultiver l'Empathie',
          objective: 'Développer la compassion envers soi-même et les autres',
          description: 'Renforce les sentiments positifs et la compassion',
          category: 'Compassion / Relations',
          color: '#FFDD8A',
          script: "Asseyez-vous confortablement et fermez les yeux. Prenez quelques respirations profondes. Visualisez une personne que vous aimez et répétez mentalement : 'Puisses-tu être heureux(se). Puisses-tu être en bonne santé. Puisses-tu être en sécurité.' Ressentez sincèrement ces souhaits. Ensuite, étendez ces mêmes souhaits à vous-même, puis à une personne neutre, et enfin à quelqu'un avec qui vous avez des difficultés. Laissez ces sentiments d'amour bienveillant se diffuser en vous. Prenez le temps de ressentir la chaleur et l'ouverture de votre cœur à chaque étape. Si des résistances ou des émotions difficiles surgissent, observez-les sans jugement et revenez doucement aux phrases de bienveillance. Terminez en étendant ces souhaits à tous les êtres, en cultivant un sentiment d'interconnexion et de compassion universelle.",
          duration: 1200,
          audioUrl: "https://storage.googleapis.com/inmymindai/meditations/amour-bienveillant.mp3",
          fractalParams: {
            type: "flame",
            zoom: "1.6",
            colorScheme: "yellow",
            speed: "0.4"
          }
        },
        {
          title: 'Respiration Profonde pour Augmenter l'Énergie',
          objective: 'Revitaliser le corps et l'esprit par une respiration contrôlée',
          description: 'Apporte énergie et clarté mentale',
          category: 'Énergie / Vitalité',
          color: '#FFA07A',
          script: "Asseyez-vous droit, les pieds bien ancrés au sol. Fermez les yeux et inspirez profondément par le nez en comptant jusqu'à quatre, retenez votre souffle pendant quatre secondes, puis expirez lentement par la bouche en comptant jusqu'à six. Répétez ce cycle plusieurs fois. À chaque inspiration, imaginez une énergie positive entrant dans votre corps, et à chaque expiration, relâchez toute fatigue ou tension. Après quelques minutes, augmentez légèrement le rythme de votre respiration, en sentant l'énergie circuler dans tout votre corps. Terminez en revenant à une respiration naturelle, en ressentant une vitalité renouvelée et une clarté mentale.",
          duration: 600,
          audioUrl: "https://storage.googleapis.com/inmymindai/meditations/respiration-energie.mp3",
          fractalParams: {
            type: "plasma",
            zoom: "1.4",
            colorScheme: "orange",
            speed: "0.6"
          }
        },
        {
          title: 'Pleine Conscience Alimentaire',
          objective: 'Encourager une relation consciente avec la nourriture',
          description: 'Aide à développer une alimentation consciente et modérée',
          category: 'Conscience / Alimentation',
          color: '#FFDAB9',
          script: "Avant de commencer votre repas, asseyez-vous confortablement et prenez quelques respirations profondes. Regardez votre nourriture, observez ses couleurs, ses textures. Sentez son arôme. Prenez une petite bouchée et mâchez lentement, en savourant chaque saveur. Remarquez les sensations dans votre bouche, la texture, le goût. Écoutez votre corps et arrêtez de manger lorsque vous vous sentez satisfait, même s'il reste de la nourriture dans votre assiette. Pendant le repas, posez vos couverts entre chaque bouchée et prenez le temps de respirer. Notez les sensations de faim et de satiété qui évoluent au cours du repas. Terminez en exprimant de la gratitude pour la nourriture et l'expérience de manger en pleine conscience.",
          duration: 900,
          audioUrl: "https://storage.googleapis.com/inmymindai/meditations/pleine-conscience-alimentaire.mp3",
          fractalParams: {
            type: "kaleidoscope",
            zoom: "1.3",
            colorScheme: "peach",
            speed: "0.3"
          }
        }
      ];

      await Meditation.insertMany(initialMeditations);
      logger.info('Méditations initiales créées avec succès');
    }
  } catch (error) {
    logger.error('Erreur lors de l\'initialisation des méditations:', error);
  }
};