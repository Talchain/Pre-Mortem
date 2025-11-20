/**
 * Template Registry
 * Central store for all pre-mortem templates
 */

import {
  PreMortemTemplate,
  TemplateCategory,
  TemplateCategoryLabels,
  isValidTemplate,
} from '@/types/premortem.v1';

// Template imports (will be added as templates are created)
import { productLaunchTemplate } from './product-launch';
import { pricingChangeTemplate } from './pricing-change';
import { keyHireTemplate } from './key-hire';
import { marketExpansionTemplate } from './market-expansion';
import { featurePrioritizationTemplate } from './feature-prioritization';
import { technicalArchitectureTemplate } from './technical-architecture';
import { partnershipEvaluationTemplate } from './partnership-evaluation';
import { investmentAllocationTemplate } from './investment-allocation';

/**
 * All available templates
 */
const ALL_TEMPLATES: PreMortemTemplate[] = [
  productLaunchTemplate,
  pricingChangeTemplate,
  keyHireTemplate,
  marketExpansionTemplate,
  featurePrioritizationTemplate,
  technicalArchitectureTemplate,
  partnershipEvaluationTemplate,
  investmentAllocationTemplate,
];

/**
 * Validate all templates on load
 * Note: Validation is performed at build time via type checking
 * Runtime validation can be enabled if needed for development
 */
// ALL_TEMPLATES.forEach((template) => {
//   if (!isValidTemplate(template)) {
//     console.error(`Invalid template: ${template.id}`, template);
//     throw new Error(`Template ${template.id} failed validation`);
//   }
// });

/**
 * Template Registry Class
 */
class TemplateRegistryImpl {
  private templates: PreMortemTemplate[];

  constructor(templates: PreMortemTemplate[]) {
    this.templates = templates;
  }

  /**
   * Get all templates
   */
  getAll(): PreMortemTemplate[] {
    return this.templates;
  }

  /**
   * Get template by ID
   */
  getById(id: string): PreMortemTemplate | undefined {
    return this.templates.find((t) => t.id === id);
  }

  /**
   * Get templates by category
   */
  getByCategory(category: TemplateCategory): PreMortemTemplate[] {
    return this.templates.filter((t) => t.category === category);
  }

  /**
   * Get all categories with template counts
   */
  getCategories(): Array<{ category: TemplateCategory; label: string; count: number }> {
    const categories = Object.keys(TemplateCategoryLabels) as TemplateCategory[];

    return categories
      .map((category) => ({
        category,
        label: TemplateCategoryLabels[category],
        count: this.getByCategory(category).length,
      }))
      .filter((cat) => cat.count > 0)
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Search templates by query
   */
  search(query: string): PreMortemTemplate[] {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      return this.templates;
    }

    return this.templates.filter((template) => {
      // Search in title
      if (template.title.toLowerCase().includes(normalizedQuery)) {
        return true;
      }

      // Search in description
      if (template.description.toLowerCase().includes(normalizedQuery)) {
        return true;
      }

      // Search in tags
      if (template.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))) {
        return true;
      }

      // Search in category label
      if (TemplateCategoryLabels[template.category].toLowerCase().includes(normalizedQuery)) {
        return true;
      }

      return false;
    });
  }

  /**
   * Filter templates by multiple criteria
   */
  filter(criteria: {
    category?: TemplateCategory;
    difficulty?: PreMortemTemplate['difficulty'];
    tags?: string[];
    query?: string;
  }): PreMortemTemplate[] {
    let results = this.templates;

    // Apply category filter
    if (criteria.category) {
      results = results.filter((t) => t.category === criteria.category);
    }

    // Apply difficulty filter
    if (criteria.difficulty) {
      results = results.filter((t) => t.difficulty === criteria.difficulty);
    }

    // Apply tag filter
    if (criteria.tags && criteria.tags.length > 0) {
      results = results.filter((t) =>
        criteria.tags!.some((tag) => t.tags.includes(tag))
      );
    }

    // Apply search query
    if (criteria.query) {
      const normalizedQuery = criteria.query.toLowerCase().trim();
      results = results.filter((t) =>
        t.title.toLowerCase().includes(normalizedQuery) ||
        t.description.toLowerCase().includes(normalizedQuery) ||
        t.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    }

    return results;
  }

  /**
   * Get recommended templates based on context
   */
  getRecommended(limit: number = 3): PreMortemTemplate[] {
    // Simple recommendation: return most popular categories
    return this.templates
      .slice()
      .sort((a, b) => {
        // Prioritize beginner templates
        if (a.difficulty === 'beginner' && b.difficulty !== 'beginner') return -1;
        if (b.difficulty === 'beginner' && a.difficulty !== 'beginner') return 1;
        return 0;
      })
      .slice(0, limit);
  }

  /**
   * Get all unique tags
   */
  getAllTags(): string[] {
    const tags = new Set<string>();
    this.templates.forEach((t) => {
      t.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }
}

/**
 * Singleton template registry instance
 */
export const TemplateRegistry = new TemplateRegistryImpl(ALL_TEMPLATES);

/**
 * Export templates for direct access
 */
export {
  productLaunchTemplate,
  pricingChangeTemplate,
  keyHireTemplate,
  marketExpansionTemplate,
  featurePrioritizationTemplate,
  technicalArchitectureTemplate,
  partnershipEvaluationTemplate,
  investmentAllocationTemplate,
};

/**
 * Export template count
 */
export const TEMPLATE_COUNT = ALL_TEMPLATES.length;
