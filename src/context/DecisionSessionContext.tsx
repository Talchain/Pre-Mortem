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
import { processConversationalMessage } from '@/services/aiOrchestration';

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
      if (!state.session || !state.selectedModel) return;

      // Add user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

      // Set typing indicator
      dispatch({ type: 'SET_TYPING', payload: true });

      try {
        // Get AI response via orchestration
        const response = await processConversationalMessage(
          content,
          state.session,
          state.session.conversation,
          state.selectedModel
        );

        // Add AI response message
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: 'olumi',
          content: response.content,
          timestamp: new Date().toISOString(),
          reasoning: response.reasoning,
          metadata: response.metadata,
        };

        dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });

        // If context was extracted, update session
        if (response.metadata?.extractedContext) {
          const fullContext = {
            ...response.metadata.extractedContext,
            options: response.metadata.extractedContext.options || [],
            factors: response.metadata.extractedContext.factors || [],
            stakeholders: response.metadata.extractedContext.stakeholders || [],
          };
          dispatch({ type: 'EXTRACT_CONTEXT', payload: fullContext });
        }
      } catch (error) {
        console.error('Failed to get AI response:', error);

        // Add error message
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: 'system',
          content: 'I encountered an error. Could you try rephrasing your message?',
          timestamp: new Date().toISOString(),
        };

        dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
      } finally {
        dispatch({ type: 'SET_TYPING', payload: false });
      }
    },
    [state.session, state.selectedModel]
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
