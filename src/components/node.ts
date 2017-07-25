import * as team from './team';
interface node_constructor_options{
    name?: string;
    team_upper?:team.team;   
    team_lower?:team.team;
    next_node?: node | null;
    previous_node?: node | null;
    round?: number;
    upper_wins?: number;
    lower_wins?: number;
    best_of?: number;
}
class node {
    name: string;
    team_upper: team.team | null;
    team_lower: team.team | null;
    next_node: node | null;
    previous_node: node | null;
    round: number;
    upper_wins: number;
    lower_wins: number;
    best_of: number;
    constructor({name = "", team_upper = null, team_lower = null, next_node = null, previous_node = null, round = -1, upper_wins = 0, lower_wins = 0, best_of = 1}:node_constructor_options = {}){
        this.name = name;
        this.team_upper = team_upper;
        this.team_lower = team_lower;
        this.next_node = next_node;
        this.previous_node = previous_node;
        this.round = round;
        this.upper_wins = upper_wins;
        this.lower_wins = lower_wins;
        this.best_of = best_of;
    }

    dq_team(dq_team: team.team | "upper" | "lower"){
        if(this.team_upper !== null && this.team_lower !== null){
            let round_win:team.round = {round:this.round, bracket_location: this.name, win:true, wins:0, losses:0};
            let round_lose:team.round = {round:this.round, bracket_location: this.name, win:false, wins:-1, losses:0};
            if(dq_team instanceof team.team){
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

    declare_winner(winner: team.team | "upper" | "lower"){
                if(winner instanceof team.team){
                    if(Object.is(winner, this.team_upper)){
                        this.team_upper.rounds.push(round_win);
                        this.team_lower.rounds.push(round_lose);
                    } else if(Object.is(winner, this.team_lower)){
                        this.team_upper.rounds.push(round_lose);
                        this.team_lower.rounds.push(round_win);
                    } else {
                        throw new Error("winner parameter should be either a team object that is in this node, the string value 'winner', or the string value 'loser'");
                    }
                } else if(typeof winner === "string"){
                    if(winner === "upper"){
                        this.team_upper.rounds.push(round_win);
                        this.team_lower.rounds.push(round_lose);
                    } else if(winner === "lower"){
                        this.team_upper.rounds.push(round_lose);
                        this.team_lower.rounds.push(round_win);
                    } else{
                        throw new Error("winner parameter should be either a team object that is in this node, the string value 'winner', or the string value 'loser'");
                    }
                } else{
                    throw new Error("winner parameter should be either a team object that is in this node, the string value 'winner', or the string value 'loser'");
                }
        if(this.upper_wins > this.best_of/2 || this.lower_wins > this.best_of/2){
            if(this.team_upper !== null && this.team_lower !== null){

                let round_winner_wins = this.upper_wins > this.lower_wins ? this.upper_wins : this.lower_wins;
                let round_loser_wins = this.upper_wins < this.lower_wins ? this.upper_wins : this.lower_wins;
                let round_winner_losses = round_loser_wins;
                let round_loser_losses = round_winner_wins;

                let round_win:team.round = {round:this.round, bracket_location: this.name, win:true, wins:round_winner_wins, losses:round_winner_losses};
                let round_lose:team.round = {round:this.round, bracket_location: this.name, win:false, wins:round_loser_wins, losses:round_loser_losses};

                if (this.upper_wins > this.lower_wins) {
                    this.team_upper.rounds.push(round_win);
                    this.team_lower.rounds.push(round_lose);
                } else {
                    this.team_upper.rounds.push(round_lose);
                    this.team_lower.rounds.push(round_win);
                }
            }
        }
    }
}