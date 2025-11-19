import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { preMortemReducer, initialState, AppState, Action } from './PreMortemReducer';
import { saveAnalysis, loadAnalysis } from '@/services/localStorage';

interface PreMortemContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const PreMortemContext = createContext<PreMortemContextType | undefined>(
  undefined
);

export function PreMortemProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(preMortemReducer, initialState);

  // Load saved analysis on mount
  useEffect(() => {
    const saved = loadAnalysis();
    if (saved) {
      dispatch({ type: 'LOAD_ANALYSIS', payload: saved });
    }
  }, []);

  // Auto-save analysis every 30 seconds or when it updates
  useEffect(() => {
    if (state.currentAnalysis) {
      const saveTimeout = setTimeout(() => {
        saveAnalysis(state.currentAnalysis!);
      }, 1000); // Save 1 second after last update

      return () => clearTimeout(saveTimeout);
    }
  }, [state.currentAnalysis]);

  return (
    <PreMortemContext.Provider value={{ state, dispatch }}>
      {children}
    </PreMortemContext.Provider>
  );
}

export function usePreMortem() {
  const context = useContext(PreMortemContext);
  if (context === undefined) {
    throw new Error('usePreMortem must be used within a PreMortemProvider');
  }
  return context;
}
