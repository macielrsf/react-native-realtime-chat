// frontend/src/app/App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigation } from '../core/presentation/navigation';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
};

export default App;
