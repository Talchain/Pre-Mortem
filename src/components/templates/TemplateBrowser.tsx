/**
 * TemplateBrowser Component
 * Browse and select pre-mortem templates
 */

import { useState, useMemo } from 'react';
import { PreMortemTemplate, TemplateCategory, TemplateCategoryLabels } from '@/types/premortem.v1';
import { TemplateRegistry } from '@/data/templates';
import { TemplateCard } from './TemplateCard';
import { TemplateDetailModal } from './TemplateDetailModal';
import styles from './TemplateBrowser.module.css';

interface TemplateBrowserProps {
  onSelectTemplate: (template: PreMortemTemplate) => void;
  onSkipTemplate: () => void;
}

type FilterType = 'all' | TemplateCategory;

export function TemplateBrowser({ onSelectTemplate, onSkipTemplate }: TemplateBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<FilterType>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<PreMortemTemplate | null>(null);

  // Get all templates
  const allTemplates = TemplateRegistry.getAll();

  // Get available categories
  const categories = TemplateRegistry.getCategories();

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let results = allTemplates;

    // Apply category filter
    if (categoryFilter !== 'all') {
      results = results.filter((t) => t.category === categoryFilter);
    }

    // Apply search filter
    if (searchQuery) {
      results = TemplateRegistry.search(searchQuery);
      if (categoryFilter !== 'all') {
        results = results.filter((t) => t.category === categoryFilter);
      }
    }

    return results;
  }, [searchQuery, categoryFilter, allTemplates]);

  const handleTemplateClick = (template: PreMortemTemplate) => {
    setSelectedTemplate(template);
  };

  const handleCloseModal = () => {
    setSelectedTemplate(null);
  };

  const handleUseTemplate = (template: PreMortemTemplate) => {
    setSelectedTemplate(null);
    onSelectTemplate(template);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Choose a Template</h1>
        <p className={styles.subtitle}>
          Start with a pre-built template tailored to common decision types, or skip to create
          your own pre-mortem from scratch.
        </p>
      </div>

      {/* Search and Filters */}
      <div className={styles.controls}>
        {/* Search */}
        <div className={styles.searchBar}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search templates by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className={styles.searchClear} onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${categoryFilter === 'all' ? styles.filterButtonActive : ''}`}
            onClick={() => setCategoryFilter('all')}
          >
            All Templates ({allTemplates.length})
          </button>
          {categories.map(({ category, label, count }) => (
            <button
              key={category}
              className={`${styles.filterButton} ${categoryFilter === category ? styles.filterButtonActive : ''}`}
              onClick={() => setCategoryFilter(category)}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {(searchQuery || categoryFilter !== 'all') && (
        <div className={styles.resultsCount}>
          <span className={styles.resultsCountStrong}>{filteredTemplates.length}</span> template
          {filteredTemplates.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Template Grid */}
      {filteredTemplates.length > 0 ? (
        <div className={styles.grid}>
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={() => handleTemplateClick(template)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔍</div>
          <h3 className={styles.emptyTitle}>No Templates Found</h3>
          <p className={styles.emptyText}>
            No templates match your search criteria. Try adjusting your filters or search terms.
          </p>
          <button className={styles.clearFiltersButton} onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>
      )}

      {/* Skip to Scratch */}
      <div className={styles.skipSection}>
        <p className={styles.skipText}>
          Prefer to start from scratch without a template?
        </p>
        <button className={styles.skipButton} onClick={onSkipTemplate}>
          Create Custom Pre-Mortem
        </button>
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <TemplateDetailModal
          template={selectedTemplate}
          onClose={handleCloseModal}
          onUseTemplate={() => handleUseTemplate(selectedTemplate)}
        />
      )}
    </div>
  );
}
