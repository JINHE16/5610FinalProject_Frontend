// src/Kanbas/Quizzes/types.ts
export type Question = {
  _id?: string;  // Use _id to match MongoDB
  id?: string;   // Keep id for backward compatibility
  title: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK';
  points: number;
  question: string;
  choices?: string[];
  correctAnswer?: string | boolean;
  possibleAnswers?: string[];
};
  
  export type Quiz = {
    _id: string;
    title: string;
    available_from: string;
    available_until: string;
    due_date: string;
    points: number;
    questions: Question[];
    published: boolean;
  };