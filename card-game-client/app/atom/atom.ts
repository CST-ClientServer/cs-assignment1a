import {atom} from "jotai";
import {QuizCard} from "@/app/components/ui/admin-card";
import {atomWithStorage} from "jotai/utils";


export const initialQuizCardList = atom([] as QuizCard[]);
export const initialGamer = atomWithStorage('gamer' , {
    id: 0,
    email: "",
    role: "",
    firstName: "",
    lastName: "",
});