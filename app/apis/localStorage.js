import AsyncStorage from '@react-native-community/async-storage';

const getLocalStorageKey = (keyString) => {
  switch(keyString) {
    default:
      return '@watchedMovieList_key';
      break;
    case "watchedMovieList":
      return '@watchedMovieList_key';
      break;
  }
};

export const getLocalData = (keyString) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(getLocalStorageKey(keyString))
    .then(res => {
      if (res !== null) resolve(res); // result is string
      else resolve(''); // return empty string
    })
    .catch(err => reject(err));
  });
};

export const setLocalData = (keyString, dataInObj) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.setItem(getLocalStorageKey(keyString), JSON.stringify(dataInObj))
    .then(res => {
      if (res !== null) resolve(true);
      else resolve(false);
    })
    .catch(err => reject(err));
  });
};
