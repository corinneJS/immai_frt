import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Avatar, List, Button, Divider, Text, Portal, Dialog, TextInput, Switch, HelperText } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logout, loginSuccess } from '../../store/slices/authSlice';
import { RootState } from '../../types/store';
import { userService } from '../../services/api';

interface ProfileData {
  user: {
    id: string;
    email: string;
    name: string;
    profile: {
      language: 'fr' | 'en';
      notifications: boolean;
    };
  };
  stats: {
    completedExercises: number;
    chatSessions: number;
    lastActive: string;
  };
  preferences: {
    language: 'fr' | 'en';
    notifications: boolean;
  };
}

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // États pour le dialogue de modification du profil
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  // États pour les paramètres
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [languageDialogVisible, setLanguageDialogVisible] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const userProfile = await userService.getProfile();
      setProfile(userProfile);
      setNotificationsEnabled(userProfile.preferences.notifications);
      setLanguage(userProfile.preferences.language);
    } catch (err: any) {
      setError('Erreur lors du chargement du profil');
      console.error('Erreur profil:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadProfile().finally(() => setRefreshing(false));
  }, []);

  const handleUpdateProfile = async () => {
    if (!editName || !editEmail) return;

    try {
      setLoading(true);
      setError('');
      const response = await userService.updateProfile({
        name: editName,
        email: editEmail
      });
      
      if (response.user) {
        dispatch(loginSuccess({ 
          user: response.user,
          token: null // On garde le token existant
        }));
        setEditDialogVisible(false);
        await loadProfile();
      }
    } catch (err: any) {
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (key: string, value: any) => {
    try {
      setLoading(true);
      setError('');
      await userService.updateSettings({ [key]: value });
      
      if (key === 'notifications') {
        setNotificationsEnabled(value);
      } else if (key === 'language') {
        setLanguage(value);
        setLanguageDialogVisible(false);
      }
      await loadProfile();
    } catch (err: any) {
      setError('Erreur lors de la mise à jour des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={user?.name?.split(' ').map(n => n[0]).join('') || 'U'} 
        />
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {error ? <HelperText type="error" visible>{error}</HelperText> : null}

      <List.Section>
        <List.Subheader>Statistiques</List.Subheader>
        <List.Item
          title="Exercices complétés"
          description={profile?.stats?.completedExercises?.toString() || '0'}
          left={props => <List.Icon {...props} icon="check-circle" />}
        />
        <List.Item
          title="Sessions de chat"
          description={profile?.stats?.chatSessions?.toString() || '0'}
          left={props => <List.Icon {...props} icon="chat" />}
        />
        <List.Item
          title="Dernière activité"
          description={profile?.stats?.lastActive ? new Date(profile.stats.lastActive).toLocaleDateString() : '-'}
          left={props => <List.Icon {...props} icon="clock" />}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Paramètres</List.Subheader>
        <List.Item
          title="Notifications"
          right={() => (
            <Switch
              value={notificationsEnabled}
              onValueChange={value => handleUpdateSettings('notifications', value)}
              disabled={loading}
            />
          )}
          left={props => <List.Icon {...props} icon="bell" />}
        />
        <List.Item
          title="Langue"
          description={language === 'fr' ? 'Français' : 'English'}
          onPress={() => setLanguageDialogVisible(true)}
          left={props => <List.Icon {...props} icon="translate" />}
        />
      </List.Section>

      <View style={styles.buttonContainer}>
        <Button 
          mode="outlined" 
          onPress={() => setEditDialogVisible(true)}
          style={styles.button}
        >
          Modifier le profil
        </Button>
        <Button 
          mode="contained" 
          onPress={handleLogout}
          style={styles.button}
        >
          Se déconnecter
        </Button>
      </View>

      {/* Dialog de modification du profil */}
      <Portal>
        <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title>Modifier le profil</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nom"
              value={editName}
              onChangeText={setEditName}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="Email"
              value={editEmail}
              onChangeText={setEditEmail}
              mode="outlined"
              style={styles.dialogInput}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Annuler</Button>
            <Button 
              onPress={handleUpdateProfile}
              loading={loading}
              disabled={loading || !editName || !editEmail}
            >
              Enregistrer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Dialog de sélection de la langue */}
      <Portal>
        <Dialog visible={languageDialogVisible} onDismiss={() => setLanguageDialogVisible(false)}>
          <Dialog.Title>Choisir la langue</Dialog.Title>
          <Dialog.Content>
            <List.Item
              title="Français"
              onPress={() => handleUpdateSettings('language', 'fr')}
              right={props => language === 'fr' ? <List.Icon {...props} icon="check" /> : null}
            />
            <List.Item
              title="English"
              onPress={() => handleUpdateSettings('language', 'en')}
              right={props => language === 'en' ? <List.Icon {...props} icon="check" /> : null}
            />
          </Dialog.Content>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    marginTop: 10,
  },
  dialogInput: {
    marginBottom: 10,
  },
});

export default ProfileScreen;