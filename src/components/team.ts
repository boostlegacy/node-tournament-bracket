export interface team_constructor_options {
    name?:string;
    size?:number;
    seed?:number;
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
export class Team{
    name:string;
    size:number;
    seed:number;
    seed_type: "Approximate" | "Exact";
    rounds: round[];
    players: string[];
    constructor({name = "", size = 1, seed = -1, seed_type = "Approximate", rounds = [], players = []}:team_constructor_options = {}){
        this.name = name;
        this.size = size;
        this.seed = seed;
        this.seed_type = seed_type;
        this.rounds = rounds;
        this.players = players;
    }
}

