export interface Category {
    id: number;
    category: string;
}

export interface FileObject {
    originalName: string;
    savedPath: string;
    savedName: string;
    size: string;
    extension: string;
}

export interface QuizCard {
    id: number;
    question: string;
    answerOptions: string[];
    answer: string;
    file?: FileObject;
    category: Category;
    subCategory: string;
}

export interface SubCategoryGroup {
    category: Category;
    subCategory: string;
    questions: QuizCard[];
}

export interface CardsContextType {
    categoryCards: Category[];
    groupedQuizCards: SubCategoryGroup[];
    quizCardList: QuizCard[];
    isLoading: boolean;
    fetchCategories: () => void;
    fetchQuizCards: () => void;
}

export interface Card {
    id: number;
    question: string;
    answerOption: string | string[];
    answer: string;
    file?: string;
    category: string;
    subCategory: string;
}
