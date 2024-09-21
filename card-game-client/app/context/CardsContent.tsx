"use client";

import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useCallback,
    useLayoutEffect,
    useRef,
} from "react";
import axios from "axios";
import {
    Category,
    QuizCard,
    SubCategoryGroup,
    CardsContextType,
    Card,
} from "../lib/types";

const CardsContext = createContext<CardsContextType | undefined>(undefined);

// Provider component
export const CardsProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [categoryCards, setCategoryCards] = useState<Category[]>([]);
    const [groupedQuizCards, setGroupedQuizCards] = useState<
        SubCategoryGroup[]
    >([]);
    const [quizCardList, setQuizCardList] = useState<QuizCard[]>([]);
    const hasFetched = useRef(false);

    // Fetch quiz cards
    const fetchQuizCards = useCallback(async () => {
        try {
            const response = await axios.get("/card/getAll");
            const quizCards: QuizCard[] = response.data.map((card: Card) => ({
                ...card,
                category: JSON.parse(card.category),
                file: card.file ? JSON.parse(card.file) : undefined,
                answerOptions:
                    typeof card.answerOption === "string"
                        ? card.answerOption.split(",")
                        : card.answerOption,
            }));
            setQuizCardList(quizCards);
            groupQuizCards(quizCards);
        } catch (error) {
            console.error("Error fetching quiz cards:", error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Group quiz cards by category and subcategory
    const groupQuizCards = useCallback((quizCards: QuizCard[]) => {
        const grouped = quizCards.reduce<SubCategoryGroup[]>((acc, card) => {
            const existingGroup = acc.find(
                (group) =>
                    group.category.id === card.category.id &&
                    group.subCategory === card.subCategory,
            );
            if (existingGroup) {
                existingGroup.questions.push(card);
            } else {
                acc.push({
                    category: card.category,
                    subCategory: card.subCategory,
                    questions: [card],
                });
            }
            return acc;
        }, []);
        setGroupedQuizCards(grouped);
    }, []);

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get("/card/getAllCategory");
            setCategoryCards(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }, []);

    useLayoutEffect(() => {
        const fetchData = async () => {
            if (!hasFetched.current) {
                setIsLoading(true);
                fetchQuizCards();
                fetchCategories();
                console.log("Fetching data...");
                setIsLoading(false);
                hasFetched.current = true;
            }
        };

        fetchData();
    }, [fetchQuizCards, fetchCategories]);

    return (
        <CardsContext.Provider
            value={{
                categoryCards,
                groupedQuizCards,
                isLoading,
                fetchCategories,
                fetchQuizCards,
                quizCardList,
            }}
        >
            {children}
        </CardsContext.Provider>
    );
};

// Hook to use the context
export const useCardsContext = () => {
    const context = useContext(CardsContext);
    if (context === undefined) {
        throw new Error("useCardsContext must be used within a CardsProvider");
    }
    return context;
};
