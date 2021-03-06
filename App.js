import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import shoppingListsReducer from './store/lists-reducer';
import AppNavigator from './navigation/AppNavigator';

import { initializeDatabase } from './helpers/db/index';

initializeDatabase().then(() => {
  console.log("Database initialized");
}).catch(err => {
  console.log("Database initialization failed.");
  console.log(err);
});

const store = createStore(shoppingListsReducer, applyMiddleware(ReduxThunk));
export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>  
  );  
}

