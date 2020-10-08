import { AsyncStorage } from 'react-native';

export const saveDataToLocalStorage = async (key, jsonData) => {
    try {
        await AsyncStorage.setItem(
            key,
            jsonData
        );
    } catch (error) {
        throw(error);
    }
};

export const loadLocalStorageData = key => {
    return AsyncStorage.getItem(key);
};

export const removeDataFromLocalStorage = key => {
    AsyncStorage.removeItem(key);
};