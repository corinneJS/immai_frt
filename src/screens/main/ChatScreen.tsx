import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { TextInput, Button, Surface, Text, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { 
  sendMessage, 
  receiveMessage, 
  setMessages,
  setLoading, 
  setError,
  clearChat 
} from '../../store/slices/chatSlice';
import { chatService } from '../../services/api';
import { RootState } from '../../types/store';

const ChatScreen = () => {
  const [messageText, setMessageText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      dispatch(setLoading(true));
      const history = await chatService.getHistory();
      dispatch(setMessages(history));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSend = async () => {
    if (messageText.trim()) {
      dispatch(setLoading(true));
      try {
        const response = await chatService.sendMessage(messageText);
        
        // Ajouter le message de l'utilisateur
        dispatch(sendMessage({
          id: response.userMessage._id || `user-${Date.now()}`,
          content: response.userMessage.content,
          isBot: false,
          timestamp: new Date(response.userMessage.createdAt).getTime(),
          sentiment: response.userMessage.sentiment
        }));

        // Ajouter la réponse du bot
        dispatch(receiveMessage({
          id: response.botMessage._id || `bot-${Date.now()}`,
          content: response.botMessage.content,
          isBot: true,
          timestamp: new Date(response.botMessage.createdAt).getTime(),
          sentiment: response.botMessage.sentiment
        }));

        setMessageText('');
        scrollViewRef.current?.scrollToEnd({ animated: true });
      } catch (error) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  const handleRefresh = () => {
    dispatch(clearChat());
    loadChatHistory();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discussion</Text>
        <IconButton 
          icon="refresh" 
          onPress={handleRefresh}
          disabled={loading}
        />
      </View>

      {error && (
        <Surface style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <IconButton icon="close" size={20} onPress={() => dispatch(setError(null))} />
        </Surface>
      )}

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <Surface 
            key={msg.id || `msg-${index}-${Date.now()}`}
            style={[
              styles.message, 
              msg.isBot ? styles.botMessage : styles.userMessage
            ]}
          >
            <Text>{msg.content}</Text>
            {msg.sentiment && (
              <Text style={styles.sentiment}>
                {msg.sentiment === 'positive' ? '😊' : msg.sentiment === 'negative' ? '😔' : '😐'}
              </Text>
            )}
          </Surface>
        ))}
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#6200ee" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Écrivez votre message..."
          mode="outlined"
          disabled={loading}
          multiline
          maxLength={500}
          right={<TextInput.Affix text={`${messageText.length}/500`} />}
        />
        <Button 
          mode="contained" 
          onPress={handleSend} 
          style={styles.sendButton}
          disabled={loading || !messageText.trim()}
          loading={loading}
        >
          Envoyer
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  errorContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#c62828',
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  message: {
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
    borderRadius: 10,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e3f2fd',
  },
  sentiment: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  inputContainer: {
    padding: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  sendButton: {
    marginLeft: 10,
  },
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
  },
});

export default ChatScreen;