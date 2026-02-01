import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <AppContext.Provider value={{ prediction, setPrediction, loading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);