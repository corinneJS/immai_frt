import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [
    {
      id: '1',
      content: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      isBot: true,
      timestamp: Date.now(),
      sentiment: 'neutral'
    },
  ],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    sendMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    receiveMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearChat: (state) => {
      state.messages = [initialState.messages[0]];
      state.error = null;
    },
  },
});

export const { 
  sendMessage, 
  receiveMessage, 
  setMessages,
  setLoading, 
  setError,
  clearChat 
} = chatSlice.actions;

export default chatSlice.reducer;