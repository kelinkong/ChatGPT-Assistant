import * as React from 'react';
import { useState } from 'react';
import { View, Text, Alert, StyleSheet, TextInput, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import Toast from 'react-native-root-toast';
import * as WebBrowser from 'expo-web-browser';
import { useApiKeyContext } from '../contexts/apiKeyContext';

const ApiKeyPage = () => {

  const { apiKey, setApiKey, selectApiType } = useApiKeyContext();
  const [apiKeyInput, setApiKeyInput] = useState(apiKey.key);

  // Function to open the OpenAI API keys page in a browser
  const openApiKeysPage = () => {
    WebBrowser.openBrowserAsync('https://platform.openai.com/api-keys');
  };

  // Function to handle API key change
  const handleKeyChange = (text: string) => {
    setApiKeyInput(text);
  };

  // Function to handle API type change
  const handleApiTypeChange = (itemValue: 'OpenAI' | 'GroqCloud') => {
    selectApiType(itemValue);
  };
  // Save API key to context
  const saveApiKey = async () => {
    if (apiKeyInput.trim().length > 0) {
      setApiKey(apiKeyInput);
      Toast.show('API key saved', { duration: Toast.durations.SHORT });
    } else {
      Alert.alert('Error', 'Please enter a valid API key');
    }
  };

  // Remove API key from context
  const removeApiKey = async () => {
    setApiKey('');
    setApiKeyInput('');
    Toast.show('API key removed', { duration: Toast.durations.SHORT });
  };

  // Function to handle button press
  const handleButtonPress = () => {
    if (apiKey.key) {
      removeApiKey();
    } else {
      saveApiKey();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        To connect with AI, add an API key. You can obtain an API key from
        {' '}
        <Text style={styles.linkText} onPress={openApiKeysPage}>
          https://platform.openai.com/api-keys
        </Text>
        .
      </Text>
      <Picker
        selectedValue={apiKey.type}
        onValueChange={handleApiTypeChange}
        style={{ height: 50, width: 200 }}
      >
        <Picker.Item label="OpenAI" value="OpenAI" style={styles.pickerItem} />
        <Picker.Item label="GroqCloud" value="GroqCloud" style={styles.pickerItem} />
      </Picker>
      <TextInput
        value={apiKeyInput}
        onChangeText={handleKeyChange}
        placeholder='Enter your API key'
        autoCorrect={false}
        autoCapitalize='none'
        style={styles.input}
        editable={!apiKey.key}
      />
      <Pressable onPress={handleButtonPress} style={styles.button}>
        <Text style={styles.buttonText}>
          {apiKey.key ? 'Remove' : 'Save'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: '#0D0D0D',
  },
  label: {
    fontSize: 16,
    color: '#fff',
  },
  linkText: {
    color: '#0F66CC',
    textDecorationLine: 'underline',
  },
  input: {
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#2F2F2F',
    borderRadius: 8,
    padding: 8,
    marginVertical: 24,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#18191a',
    borderColor: '#2F2F2F',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignSelf: 'center',
    borderWidth: 2,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: 200,
    backgroundColor: '#ffffff', // 设置背景色
    borderColor: '#cccccc',     // 设置边框颜色
    borderWidth: 1,
  },
  pickerItem: {
    color: '#000000',           // 设置选项文字颜色
  },
});

export default ApiKeyPage;