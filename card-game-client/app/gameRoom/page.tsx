import { Suspense } from "react";
import GameRoom from "./game-room";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GameRoom />
        </Suspense>
    );
}
