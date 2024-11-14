import * as yup from 'yup';

// Schéma de validation pour l'inscription
const registrationSchema = yup.object().shape({
  email: yup.string().email('Email invalide').required('Email requis'),
  password: yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').required('Mot de passe requis'),
  name: yup.string().required('Nom requis')
});

// Schéma de validation pour la connexion
const loginSchema = yup.object().shape({
  email: yup.string().email('Email invalide').required('Email requis'),
  password: yup.string().required('Mot de passe requis')
});

// Fonction de validation pour l'inscription
export const validateRegistration = async (data) => {
  try {
    await registrationSchema.validate(data, { abortEarly: false });
  } catch (error) {
    throw new Error(error.errors.join(', '));
  }
};

// Fonction de validation pour la connexion
export const validateLogin = async (data) => {
  try {
    await loginSchema.validate(data, { abortEarly: false });
  } catch (error) {
    throw new Error(error.errors.join(', '));
  }
};

export default {
  validateRegistration,
  validateLogin
};