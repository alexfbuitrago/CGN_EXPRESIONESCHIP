export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  upl1Code: string;
  upl2Code: string;
  pythonCode: string;
  technicalBenefits?: string[];
}

export interface ContextVariable {
  category: string;
  items: { name: string; type: string; desc: string }[];
}

export enum ViewState {
  DASHBOARD = 'dashboard',
  COMPARISON = 'comparison',
  EDITOR = 'editor',
  VISUAL_BUILDER = 'visual_builder',
  PYTHON_ROADMAP = 'python_roadmap'
}