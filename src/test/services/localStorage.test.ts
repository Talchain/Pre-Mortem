import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveAnalysis,
  loadAnalysis,
  clearCurrentAnalysis,
  archiveAnalysis,
  getAnalysisHistory,
  deleteFromHistory,
  clearAllData,
} from '@/services/localStorage';
import { PreMortemAnalysis } from '@/types/premortem';

const mockAnalysis: PreMortemAnalysis = {
  id: 'test-123',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-02'),
  decision: {
    title: 'Launch new feature',
    description: 'Test description',
    type: 'Feature Launch',
    timeline: '6 months',
    initialConfidence: 75,
  },
  scenarios: [],
  mitigationStrategies: [],
  adjustedConfidence: 65,
  completionStatus: 'in-progress',
  currentStep: 3,
};

describe('localStorage service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveAnalysis', () => {
    it('should save analysis to localStorage', () => {
      saveAnalysis(mockAnalysis);

      const saved = localStorage.getItem('olumi-premortem-current');
      expect(saved).toBeTruthy();

      const parsed = JSON.parse(saved!);
      expect(parsed.id).toBe('test-123');
      expect(parsed.decision.title).toBe('Launch new feature');
    });

    it('should update updatedAt timestamp', () => {
      const beforeSave = new Date();
      saveAnalysis(mockAnalysis);

      const saved = localStorage.getItem('olumi-premortem-current');
      const parsed = JSON.parse(saved!);
      const updatedAt = new Date(parsed.updatedAt);

      expect(updatedAt.getTime()).toBeGreaterThanOrEqual(beforeSave.getTime());
    });
  });

  describe('loadAnalysis', () => {
    it('should load saved analysis from localStorage', () => {
      saveAnalysis(mockAnalysis);

      const loaded = loadAnalysis();

      expect(loaded).toBeTruthy();
      expect(loaded!.id).toBe('test-123');
      expect(loaded!.decision.title).toBe('Launch new feature');
    });

    it('should return null if no analysis exists', () => {
      const loaded = loadAnalysis();
      expect(loaded).toBeNull();
    });

    it('should convert ISO strings back to Date objects', () => {
      saveAnalysis(mockAnalysis);

      const loaded = loadAnalysis();

      expect(loaded!.createdAt).toBeInstanceOf(Date);
      expect(loaded!.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('olumi-premortem-current', 'invalid json');

      const loaded = loadAnalysis();
      expect(loaded).toBeNull();
    });
  });

  describe('clearCurrentAnalysis', () => {
    it('should remove current analysis from localStorage', () => {
      saveAnalysis(mockAnalysis);
      expect(localStorage.getItem('olumi-premortem-current')).toBeTruthy();

      clearCurrentAnalysis();
      expect(localStorage.getItem('olumi-premortem-current')).toBeNull();
    });
  });

  describe('archiveAnalysis', () => {
    it('should add analysis to history', () => {
      archiveAnalysis(mockAnalysis);

      const history = getAnalysisHistory();
      expect(history).toHaveLength(1);
      expect(history[0].id).toBe('test-123');
    });

    it('should mark analysis as completed', () => {
      archiveAnalysis(mockAnalysis);

      const history = getAnalysisHistory();
      expect(history[0].completionStatus).toBe('completed');
    });

    it('should limit history to 10 items', () => {
      // Add 12 analyses
      for (let i = 0; i < 12; i++) {
        archiveAnalysis({ ...mockAnalysis, id: `test-${i}` });
      }

      const history = getAnalysisHistory();
      expect(history).toHaveLength(10);
      // Most recent should be first
      expect(history[0].id).toBe('test-11');
    });
  });

  describe('getAnalysisHistory', () => {
    it('should return empty array if no history', () => {
      const history = getAnalysisHistory();
      expect(history).toEqual([]);
    });

    it('should return all archived analyses', () => {
      archiveAnalysis(mockAnalysis);
      archiveAnalysis({ ...mockAnalysis, id: 'test-456' });

      const history = getAnalysisHistory();
      expect(history).toHaveLength(2);
    });
  });

  describe('deleteFromHistory', () => {
    it('should remove specific analysis from history', () => {
      archiveAnalysis(mockAnalysis);
      archiveAnalysis({ ...mockAnalysis, id: 'test-456' });

      deleteFromHistory('test-123');

      const history = getAnalysisHistory();
      expect(history).toHaveLength(1);
      expect(history[0].id).toBe('test-456');
    });
  });

  describe('clearAllData', () => {
    it('should remove all data from localStorage', () => {
      saveAnalysis(mockAnalysis);
      archiveAnalysis(mockAnalysis);

      clearAllData();

      expect(localStorage.getItem('olumi-premortem-current')).toBeNull();
      expect(localStorage.getItem('olumi-premortem-history')).toBeNull();
    });
  });
});
