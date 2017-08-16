import * as team from './components/team';
import * as node from './components/node';
export * from './components/team';
export * from './components/node';
export interface bracket_constructor {
    type?: "Single";
    teams?: team.Team[];
    best_of?: number;
}
export interface bracket_teams {
    [key: string]: team.Team;
}
export declare class Bracket {
    type: "Single";
    teams: bracket_teams;
    team_count: number;
    rounds: number;
    final_node: node.Node;
    default_best_of: number;
    constructor({type, teams, best_of}?: bracket_constructor);
    toString(): string;
    add_team(team: team.Team): void;
    get_round(round: number): node.Node[] | Error;
    get_node(name: string): Error | node.Node | undefined;
    set_round_best_of(round: number, best_of: number): Error | undefined;
    update_bracket_nodes_and_seeding(): void;
}
