export interface team_constructor_options {
    name?: string;
    size?: number;
    seed?: number;
    seed_type?: "Approximate" | "Exact";
    rounds?: round[];
    num_approximate_steps?: number;
    players?: string[];
}
export interface round {
    round: number;
    bracket_location: string;
    win: boolean;
    wins: number;
    losses: number;
}
export declare class Team {
    name: string;
    size: number;
    seed: number;
    seed_type: "Approximate" | "Exact";
    rounds: round[];
    players: string[];
    constructor({name, size, seed, seed_type, rounds, players}?: team_constructor_options);
}
