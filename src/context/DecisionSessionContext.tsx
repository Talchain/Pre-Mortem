/**
 * Decision Session Context - Olumi Pre-Mortem Tool v2.0
 * Provides conversational decision analysis state management
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  SessionState,
  SessionAction,
  sessionReducer,
  initialState,
} from './DecisionSessionReducer';
import { DecisionSession, Message } from '@/types/sharedModels';
import { AIModel, AI_MODELS } from '@/types/premortem';
import { saveSession, loadSession } from '@/services/sessionStorage';

/* ============================================
   CONTEXT INTERFACE
   ============================================ */

interface SessionContextValue {
  state: SessionState;
  dispatch: React.Dispatch<SessionAction>;

  // Convenience Actions
  startSession: (question: string) => void;
  sendMessage: (content: string) => Promise<void>;
  updateModel: (model: AIModel) => void;
  toggleChat: () => void;
}

const DecisionSessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

/* ============================================
   PROVIDER
   ============================================ */

interface DecisionSessionProviderProps {
  children: React.ReactNode;
}

export function DecisionSessionProvider({
  children,
}: DecisionSessionProviderProps) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  // Initialize: Load saved session or set default model
  useEffect(() => {
    const savedSession = loadSession();
    if (savedSession) {
      dispatch({ type: 'LOAD_SESSION', payload: savedSession });
    }

    // Set default model if none selected
    if (!state.selectedModel) {
      dispatch({ type: 'SET_MODEL', payload: AI_MODELS.anthropic[0] });
    }
  }, []);

  // Auto-save session to localStorage with debounce
  useEffect(() => {
    if (!state.session) return;

    const timeoutId = setTimeout(() => {
      if (state.session) {
        saveSession(state.session);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [state.session]);

  /* ========================================
     CONVENIENCE ACTIONS
     ======================================== */

  const startSession = useCallback(
    (question: string) => {
      const model = state.selectedModel || AI_MODELS.anthropic[0];
      dispatch({
        type: 'START_SESSION',
        payload: { question, model },
      });
    },
    [state.selectedModel]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!state.session) return;

      const message: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: message });

      // AI response will be handled by AI orchestration service
      // (to be implemented in Phase 4)
    },
    [state.session]
  );

  const updateModel = useCallback((model: AIModel) => {
    dispatch({ type: 'SET_MODEL', payload: model });
  }, []);

  const toggleChat = useCallback(() => {
    dispatch({ type: 'TOGGLE_CHAT' });
  }, []);

  /* ========================================
     CONTEXT VALUE
     ======================================== */

  const value: SessionContextValue = {
    state,
    dispatch,
    startSession,
    sendMessage,
    updateModel,
    toggleChat,
  };

  return (
    <DecisionSessionContext.Provider value={value}>
      {children}
    </DecisionSessionContext.Provider>
  );
}

/* ============================================
   HOOK
   ============================================ */

export function useDecisionSession(): SessionContextValue {
  const context = useContext(DecisionSessionContext);

  if (context === undefined) {
    throw new Error(
      'useDecisionSession must be used within a DecisionSessionProvider'
    );
  }

  return context;
}
