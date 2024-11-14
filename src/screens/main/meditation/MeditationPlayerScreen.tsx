import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, IconButton, ProgressBar, useTheme } from 'react-native-paper';
import { Audio } from 'expo-av';
import { useRoute } from '@react-navigation/native';
import { meditationService } from '../../../services/api';
import FractalAnimation from '../../../components/meditation/FractalAnimation';

interface MeditationPlayer {
  _id: string;
  title: string;
  fractalParams: {
    type: string;
    zoom: string;
    colorScheme: string;
    speed: string;
  };
  duration: number;
}

const MeditationPlayerScreen = () => {
  const [meditation, setMeditation] = useState<MeditationPlayer | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const route = useRoute();
  const theme = useTheme();
  const { id } = route.params as { id: string };

  useEffect(() => {
    loadMeditation();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [id]);

  const loadMeditation = async () => {
    try {
      const data = await meditationService.getMeditationById(id);
      setMeditation(data);
      await loadAudio();
    } catch (err) {
      console.error('Erreur chargement méditation:', err);
      setError('Impossible de charger la méditation');
    }
  };

  const loadAudio = async () => {
    try {
      const { sound: audioSound } = await Audio.Sound.createAsync(
        require('../../../assets/audio/meditation_6.mp3'),
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(audioSound);
    } catch (err) {
      console.error('Erreur chargement audio:', err);
      setError('Impossible de charger l\'audio');
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const handlePlayPause = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (err) {
      console.error('Erreur lecture audio:', err);
      setError('Erreur lors de la lecture');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!meditation) {
    return (
      <View style={styles.container}>
        <Text>{error || 'Chargement...'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {meditation.fractalParams && (
        <FractalAnimation {...meditation.fractalParams} />
      )}

      <View style={styles.overlay}>
        <Text style={styles.title}>{meditation.title}</Text>

        <View style={styles.controls}>
          <IconButton
            icon={isPlaying ? 'pause' : 'play'}
            size={50}
            iconColor={theme.colors.primary}
            onPress={handlePlayPause}
          />
        </View>

        <View style={styles.progressContainer}>
          <ProgressBar
            progress={duration ? position / duration : 0}
            color={theme.colors.primary}
            style={styles.progressBar}
          />
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 100,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  controls: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  progressContainer: {
    marginBottom: 50,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default MeditationPlayerScreen;