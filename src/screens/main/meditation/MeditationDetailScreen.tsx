import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Text, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { meditationService } from '../../../services/api';

interface MeditationDetail {
  _id: string;
  title: string;
  objective: string;
  category: string;
  description: string;
  duration: number;
  color: string;
}

const MeditationDetailScreen = () => {
  const [meditation, setMeditation] = useState<MeditationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();
  const { id } = route.params as { id: string };

  useEffect(() => {
    loadMeditationDetails();
  }, [id]);

  const loadMeditationDetails = async () => {
    try {
      setLoading(true);
      const data = await meditationService.getMeditationById(id);
      setMeditation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    navigation.navigate('MeditationPlayer', { id: meditation?._id });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!meditation) {
    return (
      <View style={styles.centered}>
        <Text>Méditation non trouvée</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: meditation.color + '10' }]}
      contentContainerStyle={styles.content}
    >
      <Title style={styles.title}>{meditation.title}</Title>
      <Text style={styles.category}>{meditation.category}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Objectif</Text>
        <Text>{meditation.objective}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text>{meditation.description}</Text>
      </View>

      <Button 
        mode="contained"
        onPress={handleStart}
        style={styles.button}
      >
        Commencer la méditation
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button: {
    marginTop: 20,
  },
});

export default MeditationDetailScreen;