import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ExercisesScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card} onPress={() => navigation.navigate('MeditationList')}>
        <Card.Content>
          <Title>Méditation guidée</Title>
          <Paragraph>Une séance de méditation pour apaiser votre esprit.</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>Explorer</Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Exercices de respiration</Title>
          <Paragraph>Techniques de respiration pour la relaxation.</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>Bientôt disponible</Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Journal des émotions</Title>
          <Paragraph>Exprimez et analysez vos émotions.</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>Bientôt disponible</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 15,
    elevation: 4,
  },
});

export default ExercisesScreen;