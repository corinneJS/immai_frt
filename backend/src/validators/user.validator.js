import * as yup from 'yup';

export const validateProfileUpdate = async (data) => {
  const schema = yup.object().shape({
    name: yup.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: yup.string().email('Email invalide')
  });

  await schema.validate(data);
};

export const validateSettingsUpdate = async (data) => {
  const schema = yup.object().shape({
    language: yup.string().oneOf(['fr', 'en'], 'Langue non supportée'),
    notifications: yup.boolean()
  });

  await schema.validate(data);
};