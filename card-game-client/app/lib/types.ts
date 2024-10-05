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

export interface GameRoom {
    id: number;
    pin: number;
    subCategory: string;
    createdAt: string;
}

export interface CardsContextType {
    categoryCards: Category[];
    groupedQuizCards: SubCategoryGroup[];
    quizCardList: QuizCard[];
    gameRooms: GameRoom[];
    isLoading: boolean;
    fetchCategories: () => void;
    fetchQuizCards: () => void;
    refetch: () => void;
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

export interface Question {
    id: number;
    question: string;
    subCategory: string;
    answer: string;
    answerOptions: string[];
    file?: File;
}

export interface File {
    originalName: string;
    savedPath: string;
    savedName: string;
    size: string;
    extension: string;
}

export interface SubCategory {
    category: Category;
    subCategory: string;
    questions: Question[];
}
