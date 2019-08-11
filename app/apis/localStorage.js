import AsyncStorage from '@react-native-community/async-storage';
import { keyNames } from './keyNames';

export const getLocalData = (keyString) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(keyString)
    .then(res => {
      if (res !== null) resolve(res); // result is string
      else resolve(''); // return empty string
    })
    .catch(err => reject(err));
  });
};

export const setLocalData = (keyString, dataInArray) => {
  
  return new Promise((resolve, reject) => {
    AsyncStorage.setItem(keyString, JSON.stringify(dataInArray))
    .then(res => {
      if (res !== null) resolve(true);
      else resolve(false);
    })
    .catch(err => reject(err));
  });
};
