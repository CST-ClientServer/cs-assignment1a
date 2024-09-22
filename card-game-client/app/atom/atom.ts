import { atom } from "jotai";
import { QuizCard } from "../lib/types";
import { atomWithStorage } from "jotai/utils";

export const initialQuizCardList = atom([] as QuizCard[]);
export const initialGamer = atomWithStorage("gamer", {
    id: 0,
    email: "",
    role: "",
    firstName: "",
    lastName: "",
});
