import { useState, useRef, useEffect } from 'react';
import { AIModel, AI_MODELS } from '@/types/premortem';
import { ChevronDown } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
  className?: string;
}

export function ModelSelector({
  selectedModel,
  onModelChange,
  className = '',
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Flatten all models from all providers
  const allModels = Object.values(AI_MODELS).flat();

  // Get provider icon/label
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'anthropic':
        return '🤖';
      case 'openai':
        return '✨';
      default:
        return '🔮';
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label="Select AI model"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-base">
          {getProviderIcon(selectedModel.provider)}
        </span>
        <span className="hidden sm:inline">{selectedModel.displayName}</span>
        <span className="sm:hidden">AI</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          role="listbox"
        >
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
              Anthropic
            </div>
            {AI_MODELS.anthropic.map((model) => (
              <button
                key={model.modelId}
                onClick={() => {
                  onModelChange(model);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                  selectedModel.modelId === model.modelId
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700'
                }`}
                role="option"
                aria-selected={selectedModel.modelId === model.modelId}
              >
                <span className="flex items-center gap-2">
                  <span>{getProviderIcon(model.provider)}</span>
                  <span>{model.displayName}</span>
                </span>
                {selectedModel.modelId === model.modelId && (
                  <span className="text-primary-600">✓</span>
                )}
              </button>
            ))}

            <div className="border-t border-gray-200 mt-1"></div>

            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
              OpenAI
            </div>
            {AI_MODELS.openai.map((model) => (
              <button
                key={model.modelId}
                onClick={() => {
                  onModelChange(model);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                  selectedModel.modelId === model.modelId
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700'
                }`}
                role="option"
                aria-selected={selectedModel.modelId === model.modelId}
              >
                <span className="flex items-center gap-2">
                  <span>{getProviderIcon(model.provider)}</span>
                  <span>{model.displayName}</span>
                </span>
                {selectedModel.modelId === model.modelId && (
                  <span className="text-primary-600">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 px-3 py-2 bg-gray-50">
            <p className="text-xs text-gray-500">
              AI model selection persists with your analysis
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
