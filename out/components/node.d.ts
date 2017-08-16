import * as team from './team';
export interface node_constructor_options {
    name?: string;
    team_upper?: team.Team;
    team_lower?: team.Team;
    next_node?: Node | null;
    upper_node?: Node | null;
    lower_node?: Node | null;
    round?: number;
    upper_wins?: number;
    lower_wins?: number;
    best_of?: number;
}
export declare class Node {
    name: string;
    team_upper: team.Team | null;
    team_lower: team.Team | null;
    next_node: Node | null;
    upper_node: Node | null;
    lower_node: Node | null;
    round: number;
    upper_wins: number;
    lower_wins: number;
    best_of: number;
    constructor({name, team_upper, team_lower, next_node, upper_node, lower_node, round, upper_wins, lower_wins, best_of}?: node_constructor_options);
    dq_team(dq_team: team.Team | "upper" | "lower"): void;
    declare_single_win(winner: team.Team | "upper" | "lower"): void;
}
