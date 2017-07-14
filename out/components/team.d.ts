export interface team_constructor_options {
    name?: string;
    size?: number;
    seed?: number;
    seed_type?: "Approximate" | "Exact";
    rounds?: round[];
    num_approximate_steps?: number;
}
export interface round {
    round: number;
    bracket_location: string;
    win: boolean;
}
export declare class team {
    name: string;
    size: number;
    seed: number;
    seed_type: "Approximate" | "Exact";
    rounds: round[];
    constructor({name, size, seed, seed_type, rounds}?: team_constructor_options);
}
