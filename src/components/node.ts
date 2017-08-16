import * as team from './team';
export interface node_constructor_options{
    name?: string;
    team_upper?:team.Team;   
    team_lower?:team.Team;
    next_node?: Node | null;
    upper_node?: Node | null;
    lower_node?: Node | null;
    round?: number;
    upper_wins?: number;
    lower_wins?: number;
    best_of?: number;
}
export class Node {
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
    constructor({name = "", team_upper = null, team_lower = null, next_node = null, upper_node = null, lower_node = null, round = -1, upper_wins = 0, lower_wins = 0, best_of = 1}:node_constructor_options = {}){
        this.name = name;
        this.team_upper = team_upper;
        this.team_lower = team_lower;
        this.next_node = next_node;
        this.upper_node = upper_node;
        this.lower_node = lower_node;
        this.round = round;
        this.upper_wins = upper_wins;
        this.lower_wins = lower_wins;
        this.best_of = best_of;
    }

    dq_team(dq_team: team.Team | "upper" | "lower"){
        if(this.team_upper !== null && this.team_lower !== null){
            let round_win:team.round = {round:this.round, bracket_location: this.name, win:true, wins:0, losses:0};
            let round_lose:team.round = {round:this.round, bracket_location: this.name, win:false, wins:-1, losses:0};
            if(dq_team instanceof team.Team){
                if(Object.is(dq_team, this.team_lower)){
                    this.team_upper.rounds.push(round_win);
                    this.team_lower.rounds.push(round_lose);
                } else if(Object.is(dq_team, this.team_upper)){
                    this.team_upper.rounds.push(round_lose);
                    this.team_lower.rounds.push(round_win);
                } else {
                    throw new Error("winner parameter should be either a team object that is in this node, the string value 'winner', or the string value 'loser'");
                }
            } else if(typeof dq_team === "string"){
                if(dq_team === "upper"){
                    this.team_upper.rounds.push(round_win);
                    this.team_lower.rounds.push(round_lose);
                } else if(dq_team === "lower"){
                    this.team_upper.rounds.push(round_lose);
                    this.team_lower.rounds.push(round_win);
                } else{
                    throw new Error("winner parameter should be either a team object that is in this node, the string value 'winner', or the string value 'loser'");
                }
            } else{
                throw new Error("winner parameter should be either a team object that is in this node, the string value 'winner', or the string value 'loser'");
            }
        }
    }

    /*
    declare_winner(winner: team.team | "upper" | "lower"){
    }
    */
    declare_single_win(winner: team.Team | "upper" | "lower"){
        if (this.team_upper !== null && this.team_lower !== null) {
            if (winner instanceof team.Team) {
                if (Object.is(winner, this.team_upper)) {
                    this.upper_wins++;
                } else if (Object.is(winner, this.team_lower)) {
                    this.lower_wins++;
                } else {
                    throw new Error("winner parameter should be either a team object that is in this node, the string value 'winner', or the string value 'loser'");
                }
            } else if (typeof winner === "string") {
                if (winner === "upper") {
                    this.upper_wins++;
                } else if (winner === "lower") {
                    this.lower_wins++;
                } else {
                    throw new Error("winner parameter should be either a team object that is in this node, the string value 'winner', or the string value 'loser'");
                }
            } else {
                throw new Error("winner parameter should be either a team object that is in this node, the string value 'winner', or the string value 'loser'");
            }
        }
        //console.log(this.upper_wins, this.best_of);
        if(this.upper_wins > this.best_of/2 || this.lower_wins > this.best_of/2){
            if(this.team_upper !== null && this.team_lower !== null){
                let round_winner_wins = this.upper_wins > this.lower_wins ? this.upper_wins : this.lower_wins;
                let round_loser_wins = this.upper_wins < this.lower_wins ? this.upper_wins : this.lower_wins;
                let round_winner_losses = round_loser_wins;
                let round_loser_losses = round_winner_wins;

                let round_win:team.round = {round:this.round, bracket_location: this.name, win:true, wins:round_winner_wins, losses:round_winner_losses};
                let round_lose:team.round = {round:this.round, bracket_location: this.name, win:false, wins:round_loser_wins, losses:round_loser_losses};

                if (this.upper_wins > this.lower_wins) {
                    if(this.next_node !== null){
                        if(this.next_node.upper_node !== null && this.next_node.upper_node.name === this.name){
                            this.next_node.team_upper = this.team_upper;
                        } else{
                            this.next_node.team_lower = this.team_upper;
                            //console.log(this.next_node);
                        }
                    }
                    this.team_upper.rounds.push(round_win);
                    this.team_lower.rounds.push(round_lose);
                } else {
                    if(this.next_node !== null){
                        if(this.next_node.upper_node !== null && this.next_node.upper_node.name === this.name){
                            this.next_node.team_upper = this.team_lower;
                        } else{
                            this.next_node.team_lower = this.team_lower;
                        }
                    }
                    this.team_upper.rounds.push(round_lose);
                    this.team_lower.rounds.push(round_win);
                }
            }
        }
    }
}