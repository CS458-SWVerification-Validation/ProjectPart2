import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import JWT, { SupportedAlgorithms } from 'expo-jwt';
import { useNavigation } from 'expo-router';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SurveyForm() {
  const [authToken, setAuthToken] = useState("");
  const [selectedAIModels, setSelectedAIModels] = useState([]);

  const navigation = useNavigation();
  const AI_MODELS = ['ChatGPT', 'Bard', 'Claude', 'Copilot'];

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      // We take the date as a string (example: "2000-01-01")
      birthDate: 'e.g. 2000-01-01',
      educationLevel: '',
      city: '',
      gender: '',
      defects: {},
      useCase: '',
    },
    onSubmit: async (values) => {
      // Remove any overriding of birthDate – we want to use what the user entered.
      console.log("Submitting survey for user", values);
      let user_id = JWT.decode(authToken, 'secret_key', { algorithm: SupportedAlgorithms.HS256 });
      try {
        const response = await fetch(`https://validsoftware458.com.tr:8443/survey/submit/${user_id.user_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        console.log('Server response:', data);
        navigation.navigate('index');
      } catch (error) {
        console.error('Error submitting survey:', error.message);
      }
    },
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('auth_token');
      if (value !== null) {
        setAuthToken(value);
      }
    } catch (e) {
      console.log('Auth token not retrieved');
    }
  };

  const handleAIModelChange = (model) => {
    setSelectedAIModels((prevModels) => {
      if (prevModels.includes(model)) {
        formik.setFieldValue('defects', {
          ...formik.values.defects,
          [model]: '',
        });
        return prevModels.filter((m) => m !== model);
      } else {
        return [...prevModels, model];
      }
    });
  };
 /* ---------- helpers ---------- */
  const isFuture = (yyyyMmDd) => {
    const d = new Date(yyyyMmDd);
    return !isNaN(d) && d > new Date();
  };

  const isSubmitDisabled =
    !formik.values.name.trim() ||
    !formik.values.surname.trim() ||
    !formik.values.birthDate.trim() ||
    !formik.values.city.trim() ||
    isFuture(formik.values.birthDate);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>Survey</Text>
      <Text>Name:</Text>
      <TextInput
        testID="inputName"
        accessible accessibilityLabel="inputName"
        style={styles.input}
        onChangeText={formik.handleChange('name')}
        value={formik.values.name}
      />

      <Text>Surname:</Text>
      <TextInput
        testID="inputSurname"
                accessible accessibilityLabel="inputSurname"

        style={styles.input}
        onChangeText={formik.handleChange('surname')}
        value={formik.values.surname}
      />

      <Text>Birth Date (YYYY-MM-DD):</Text>
      <TextInput
        testID="inputBirthDate"
        accessible accessibilityLabel="inputBirthDate"

        style={styles.input}
        onChangeText={formik.handleChange('birthDate')}
        value={formik.values.birthDate}
      />

      <Text>Education Level:</Text>
      <Picker
        testID="pickerEducation"
        accessible accessibilityLabel="pickerEducation"
        selectedValue={formik.values.educationLevel}
        onValueChange={formik.handleChange('educationLevel')}
      >
        <Picker.Item label="Choose One" value="" />
        <Picker.Item label="High School" value="high_school" />
        <Picker.Item label="Bachelor's Degree" value="bachelor" />
        <Picker.Item label="Master's Degree" value="master" />
        <Picker.Item label="PhD" value="phd" />
      </Picker>

      <Text>City:</Text>
      <TextInput
        testID="inputCity"
                accessible accessibilityLabel="inputCity"

        style={styles.input}
        onChangeText={formik.handleChange('city')}
        value={formik.values.city}
      />

      <Text>Gender:</Text>
      <Picker
        testID="pickerGender"
        accessible accessibilityLabel="pickerGender"
        selectedValue={formik.values.gender}
        onValueChange={formik.handleChange('gender')}
      >
        <Picker.Item label="Choose One" value="" />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Other" value="other" />
      </Picker>

      <Text>AI Models You Have Tried:</Text>
      {AI_MODELS.map((model) => (
        <View key={model} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Checkbox
            testID={`chk${model}`}
            accessible
            accessibilityLabel={`chk${model}`}
            value={selectedAIModels.includes(model)}
            onValueChange={() => handleAIModelChange(model)}
          />
          <Text>{model}</Text>
        </View>
      ))}

      {selectedAIModels.map((model) => (
        <View key={model}>
          <Text>Any defects or cons of {model}?</Text>
          <TextInput
            testID={`inputDefectsCons${model}`}
            accessible
            accessibilityLabel={`inputDefectsCons${model}`}
            style={styles.input}
            onChangeText={(text) =>
              formik.setFieldValue('defects', { ...formik.values.defects, [model]: text })
            }
            value={formik.values.defects?.[model] || ''}
          />
        </View>
      ))}

      <Text>Any use case of AI that is beneficial in daily life:</Text>
      <TextInput
        testID="inputUseCase"
                accessible accessibilityLabel="inputUseCase"

        style={styles.input}
        onChangeText={formik.handleChange('useCase')}
        value={formik.values.useCase}
      />

      <Button
              testID="btnSubmit"
              accessible
              accessibilityLabel="btnSubmit"
              title="Submit"
              disabled={isSubmitDisabled}
              onPress={formik.handleSubmit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 20,
    justifyContent: "center"
  },
  text: {
    color: "black",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 20
  }
});
