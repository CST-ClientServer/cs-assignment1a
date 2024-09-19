import {atom} from "jotai";
import {QuizCard} from "@/app/components/ui/admin-card";


export const initialQuizCardList = atom([] as QuizCard[]);