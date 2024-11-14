import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Exercise {
  id: number;
  title: string;
  description: string;
  type: 'meditation' | 'breathing' | 'journal';
  duration: number;
  completed: boolean;
}

interface ExerciseState {
  exercises: Exercise[];
  currentExercise: Exercise | null;
  loading: boolean;
  error: string | null;
}

const initialState: ExerciseState = {
  exercises: [
    {
      id: 1,
      title: 'Méditation guidée',
      description: 'Une séance de méditation pour apaiser votre esprit.',
      type: 'meditation',
      duration: 600,
      completed: false,
    },
    {
      id: 2,
      title: 'Exercices de respiration',
      description: 'Techniques de respiration pour la relaxation.',
      type: 'breathing',
      duration: 300,
      completed: false,
    },
    {
      id: 3,
      title: 'Journal des émotions',
      description: 'Exprimez et analysez vos émotions.',
      type: 'journal',
      duration: 900,
      completed: false,
    },
  ],
  currentExercise: null,
  loading: false,
  error: null,
};

const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    startExercise: (state, action: PayloadAction<number>) => {
      const exercise = state.exercises.find(ex => ex.id === action.payload);
      if (exercise) {
        state.currentExercise = exercise;
      }
    },
    completeExercise: (state, action: PayloadAction<number>) => {
      const exercise = state.exercises.find(ex => ex.id === action.payload);
      if (exercise) {
        exercise.completed = true;
      }
      state.currentExercise = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { startExercise, completeExercise, setLoading, setError } = exerciseSlice.actions;
export default exerciseSlice.reducer;