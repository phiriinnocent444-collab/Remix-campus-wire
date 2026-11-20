export interface DevLesson {
  id: string;
  title: string;
  duration: string;
  module: string;
  description: string;
  starterCode: {
    html: string;
    css: string;
    js: string;
  };
  challengeObjective: string;
  solutionHint: string;
  category: 'html_css' | 'javascript' | 'react' | 'nodejs' | 'sql' | 'deployment';
  completed?: boolean;
}

export interface DevTrack {
  id: string;
  title: string;
  hours: string;
  badge: string;
  level: string;
  description: string;
  lessonsCount: number;
  iconName: string;
}

export interface ApiEndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  category: string;
  summary: string;
  description: string;
  headers?: Record<string, string>;
  params?: Array<{ name: string; type: string; required: boolean; description: string; default?: string }>;
  bodyTemplate?: any;
  responseSample: any;
}

export interface SqlQueryResult {
  success: boolean;
  query: string;
  columns: string[];
  rows: Array<Record<string, any>>;
  rowCount: number;
  executionTimeMs: number;
  error?: string;
}

export interface DatabaseSchemaTable {
  name: string;
  description: string;
  rowCount: number;
  columns: Array<{
    name: string;
    type: string;
    isPrimaryKey: boolean;
    nullable: boolean;
    description: string;
  }>;
}

export interface DevProjectTemplate {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tech: string[];
  description: string;
  previewImage?: string;
  code: {
    html: string;
    css: string;
    js: string;
  };
}
