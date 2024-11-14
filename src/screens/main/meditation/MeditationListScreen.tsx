import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, useTheme, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { meditationService } from '../../../services/api';

interface Meditation {
  _id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  duration: number;
}

const MeditationListScreen = () => {
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    loadMeditations();
  }, []);

  const loadMeditations = async () => {
    try {
      setLoading(true);
      const data = await meditationService.getAllMeditations();
      setMeditations(data);
    } catch (err) {
      setError('Erreur lors du chargement des méditations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const renderMeditationCard = ({ item }: { item: Meditation }) => (
    <Card
      style={[styles.card, { backgroundColor: item.color + '20' }]}
      onPress={() => navigation.navigate('MeditationDetail', { id: item._id })}
    >
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph style={styles.category}>{item.category}</Paragraph>
        <Paragraph>{item.description}</Paragraph>
        <Paragraph style={styles.duration}>
          Durée: {formatDuration(item.duration)}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={meditations}
        renderItem={renderMeditationCard}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  category: {
    marginBottom: 8,
    opacity: 0.7,
  },
  duration: {
    marginTop: 8,
    fontWeight: 'bold',
  },
});

export default MeditationListScreen;