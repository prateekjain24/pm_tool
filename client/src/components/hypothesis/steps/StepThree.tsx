import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CHARACTER_LIMITS, VALIDATION_MESSAGES } from "@/types/hypothesis-builder";
import type { StepProps, Reasoning, Evidence } from "@/types/hypothesis-builder";
import { X, Plus, Link, Eye, EyeOff, AlertCircle } from "lucide-react";

// Example reasoning statements
const reasoningExamples = [
  {
    category: "Data-Driven",
    example: "Based on our Q3 user survey, 68% of users indicated they abandon checkout due to unclear shipping costs. By showing shipping estimates upfront, we can reduce this friction point and improve conversion."
  },
  {
    category: "Psychology-Based",
    example: "The principle of social proof suggests users are more likely to take action when they see others doing the same. Adding 'X people bought this today' leverages this behavior to increase urgency and trust."
  },
  {
    category: "Competitive Analysis",
    example: "Our top 3 competitors all use one-click checkout for returning customers, resulting in 15-20% higher conversion rates according to industry reports. Implementing this feature will bring us to parity."
  }
];

// URL validation regex
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function StepThree({ value, onChange, className }: StepProps) {
  // Handle null values with default reasoning structure
  const reasoning: Reasoning = value && typeof value === 'object' && 'mainReasoning' in value
    ? value as Reasoning
    : { mainReasoning: '', evidence: [] };
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [newEvidenceTitle, setNewEvidenceTitle] = useState("");
  const [newEvidenceUrl, setNewEvidenceUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);

  const characterCount = reasoning.mainReasoning.length;
  const maxCharacters = CHARACTER_LIMITS.reasoning;
  const remainingCharacters = maxCharacters - characterCount;

  // Auto-focus on mount
  useEffect(() => {
    if (!isPreviewMode && reasoning.mainReasoning.length === 0) {
      // Focus on markdown editor div
      const editorTextarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
      editorTextarea?.focus();
    }
  }, [isPreviewMode, reasoning.mainReasoning.length]);

  // Handle reasoning change
  const handleReasoningChange = (value?: string) => {
    if (value !== undefined && value.length <= maxCharacters) {
      onChange({
        ...reasoning,
        mainReasoning: value
      });
    }
  };

  // Handle evidence addition
  const handleAddEvidence = () => {
    const trimmedTitle = newEvidenceTitle.trim();
    const trimmedUrl = newEvidenceUrl.trim();

    if (!trimmedTitle || !trimmedUrl) return;

    if (!isValidUrl(trimmedUrl)) {
      setUrlError("Please enter a valid URL");
      return;
    }

    const newEvidence: Evidence = {
      title: trimmedTitle,
      url: trimmedUrl
    };

    onChange({
      ...reasoning,
      evidence: [...reasoning.evidence, newEvidence]
    });

    // Reset form
    setNewEvidenceTitle("");
    setNewEvidenceUrl("");
    setUrlError("");
    titleInputRef.current?.focus();
  };

  // Handle evidence removal
  const handleRemoveEvidence = (index: number) => {
    onChange({
      ...reasoning,
      evidence: reasoning.evidence.filter((_, i) => i !== index)
    });
  };

  // Handle URL input change
  const handleUrlChange = (value: string) => {
    setNewEvidenceUrl(value);
    if (urlError && value.trim()) {
      setUrlError("");
    }
  };

  // Handle example click
  const handleExampleClick = (example: string) => {
    handleReasoningChange(example);
  };

  // Determine character counter color
  const getCharacterCountColor = () => {
    if (remainingCharacters < 50) return "text-destructive";
    if (remainingCharacters < 200) return "text-orange-500";
    return "text-muted-foreground";
  };

  // Validation
  const isValid = reasoning.mainReasoning.trim().length >= 10;
  const showError = reasoning.mainReasoning.length > 0 && !isValid;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Why do you think this will work?</h2>
        <p className="text-muted-foreground">
          Explain your reasoning with data, user research, or insights. Include evidence to support your hypothesis.
        </p>
      </div>

      {/* Main reasoning editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="reasoning-editor">Your Reasoning</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="gap-2"
          >
            {isPreviewMode ? (
              <>
                <Eye className="h-4 w-4" />
                Edit
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                Preview
              </>
            )}
          </Button>
        </div>

        <div className="relative">
          <div data-color-mode="light">
            <MDEditor
              id="reasoning-editor"
              value={reasoning.mainReasoning}
              onChange={handleReasoningChange}
              preview={isPreviewMode ? "preview" : "edit"}
              hideToolbar={isPreviewMode}
              textareaProps={{
                placeholder: "Explain why you believe this change will have the expected impact...",
                maxLength: maxCharacters,
              }}
              height={200}
              className={cn(
                showError && "border-destructive"
              )}
            />
          </div>

          {/* Character counter */}
          {!isPreviewMode && (
            <div 
              className={cn(
                "absolute bottom-2 right-2 text-xs font-medium z-10 bg-background px-2 py-1 rounded",
                getCharacterCountColor()
              )}
            >
              {characterCount}/{maxCharacters}
            </div>
          )}
        </div>

        {/* Error message */}
        {showError && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {reasoning.mainReasoning.trim().length === 0 
              ? VALIDATION_MESSAGES.required 
              : VALIDATION_MESSAGES.tooShort}
          </p>
        )}
      </div>

      {/* Evidence section */}
      <div className="space-y-4">
        <div>
          <Label>Supporting Evidence</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Add links to research, data, or articles that support your reasoning
          </p>
        </div>

        {/* Existing evidence */}
        {reasoning.evidence.length > 0 && (
          <div className="space-y-2">
            {reasoning.evidence.map((evidence, index) => (
              <Card key={`${evidence.title}-${index}`} className="bg-muted/50">
                <CardContent className="flex items-center justify-between p-3">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <Link className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{evidence.title}</p>
                      <a 
                        href={evidence.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary truncate block"
                      >
                        {evidence.url}
                      </a>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveEvidence(index)}
                    className="h-8 w-8 p-0 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add new evidence form */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="evidence-title">Title</Label>
                <Input
                  ref={titleInputRef}
                  id="evidence-title"
                  value={newEvidenceTitle}
                  onChange={(e) => setNewEvidenceTitle(e.target.value)}
                  placeholder="e.g., User Survey Results Q3 2024"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newEvidenceTitle.trim()) {
                      e.preventDefault();
                      const urlInput = document.getElementById('evidence-url') as HTMLInputElement;
                      urlInput?.focus();
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evidence-url">URL</Label>
                <Input
                  id="evidence-url"
                  value={newEvidenceUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://example.com/research"
                  className={cn(urlError && "border-destructive")}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newEvidenceTitle.trim() && newEvidenceUrl.trim()) {
                      e.preventDefault();
                      handleAddEvidence();
                    }
                  }}
                />
                {urlError && (
                  <p className="text-xs text-destructive">{urlError}</p>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddEvidence}
              disabled={!newEvidenceTitle.trim() || !newEvidenceUrl.trim()}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Evidence
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Examples section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <span className="text-lg">💡</span> Examples of Strong Reasoning
        </h3>
        
        <div className="grid gap-3">
          {reasoningExamples.map((item) => (
            <Card 
              key={item.category}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleExampleClick(item.example)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-primary">{item.category}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.example}
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Click to use this example
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips section */}
      <div className="rounded-lg bg-muted/50 p-4 space-y-2">
        <p className="text-sm font-medium">🎯 Tips for Strong Reasoning:</p>
        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
          <li>• Use specific data points and percentages when possible</li>
          <li>• Reference user research, surveys, or analytics</li>
          <li>• Cite industry best practices or competitor examples</li>
          <li>• Include behavioral psychology principles when relevant</li>
          <li>• Link to supporting documentation or research</li>
          <li>• Be concise but thorough - quality over quantity</li>
        </ul>
      </div>
    </div>
  );
}