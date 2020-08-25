import React from 'react';

import AppNavigator from './navigation/AppNavigator';

import { init, init2 } from './helpers/db';

init().then(() => {
  console.log("Database initialized");
}).catch(err => {
  console.log("Database initialization failed.");
  console.log(err);
});


export default function App() {
  return <AppNavigator />;  
}

