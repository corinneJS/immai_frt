import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

// Écran d'accueil
const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Bienvenue sur InMyMindAI</Title>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>État d'esprit actuel</Title>
          <Paragraph>Comment vous sentez-vous aujourd'hui ?</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Exercices recommandés</Title>
          <Paragraph>Découvrez les exercices personnalisés pour vous.</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Votre progression</Title>
          <Paragraph>Suivez votre évolution et vos accomplissements.</Paragraph>
        </Card.Content>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    marginBottom: 15,
    elevation: 4,
  },
});

export default HomeScreen;