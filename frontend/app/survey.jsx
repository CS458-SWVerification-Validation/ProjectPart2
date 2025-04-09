import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import JWT, { SupportedAlgorithms } from 'expo-jwt';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, Text, TextInput, View } from 'react-native';

export default function SurveyForm() {
  const [authToken, setAuthToken] = useState("");
  const [selectedAIModels, setSelectedAIModels] = useState([]);
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  
  const AI_MODELS = ['ChatGPT', 'Bard', 'Claude', 'Copilot'];

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      birthDate: new Date(),
      educationLevel: '',
      city: '',
      gender: '',
      defects: {},
      useCase: '',
    },
    onSubmit: async (values) => {
      values.birthDate = date
      let user_id = JWT.decode(authToken, 'secret_key', { algorithm: SupportedAlgorithms.HS256 });
      console.log(user_id.user_id, values)
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
      } catch (error) {
        console.error('Error submitting survey:', error.message);
      }
    },
  });

  useEffect(() => {
    getData()
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('auth_token');
      console.log(value)
      if (value !== null) {
        setAuthToken(value)
        // value previously stored
      }
    } catch (e) {
      console.log("Auth token not retrieved")
      // error reading value
    }
  };

  const handleAIModelChange = (model) => {
    setSelectedAIModels((prevModels) => {
      if (prevModels.includes(model)) {
        return prevModels.filter((m) => m !== model);
      } else {
        return [...prevModels, model];
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Name:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        onChangeText={formik.handleChange('name')}
        value={formik.values.name}
      />

      <Text>Surname:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        onChangeText={formik.handleChange('surname')}
        value={formik.values.surname}
      />

      <Text>Birth Date: {date.toLocaleString()}</Text>
      <Button onPress={showDatepicker} title="Show date picker!" />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={formik.values.birthDate}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}

      <Text>Education Level:</Text>
      <Picker
        selectedValue={formik.values.educationLevel}
        onValueChange={formik.handleChange('educationLevel')}
      >
        <Picker.Item label="High School" value="high_school" />
        <Picker.Item label="Bachelor's Degree" value="bachelor" />
        <Picker.Item label="Master's Degree" value="master" />
        <Picker.Item label="PhD" value="phd" />
      </Picker>

      <Text>City:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        onChangeText={formik.handleChange('city')}
        value={formik.values.city}
      />

      <Text>Gender:</Text>
      <Picker
        selectedValue={formik.values.gender}
        onValueChange={formik.handleChange('gender')}
      >
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Other" value="other" />
      </Picker>

      <Text>AI Models You Have Tried:</Text>
      {AI_MODELS.map((model) => (
        <View key={model} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Checkbox
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
            style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            onChangeText={(text) =>
              formik.setFieldValue('defects', { ...formik.values.defects, [model]: text })
            }
            value={formik.values.defects?.[model] || ''}
          />
        </View>
      ))}

      <Text>Any use case of AI that is beneficial in daily life:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        onChangeText={formik.handleChange('useCase')}
        value={formik.values.useCase}
      />

      <Button title="Submit" onPress={formik.handleSubmit} />
    </ScrollView>
  );
};