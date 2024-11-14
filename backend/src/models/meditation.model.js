import mongoose from 'mongoose';

const meditationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  objective: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Pleine Conscience', 'Gestion de la Douleur', 'Relaxation / Sommeil', 
           'Compassion / Relations', 'Énergie / Vitalité', 'Conscience / Alimentation']
  },
  color: {
    type: String,
    required: true,
    match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  },
  script: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // durée en secondes
    required: true
  },
  audioUrl: {
    type: String
  },
  fractalParams: {
    type: Map,
    of: String,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

meditationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Meditation', meditationSchema);