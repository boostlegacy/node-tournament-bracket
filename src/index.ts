import * as team from './components/team';
import * as node from './components/node';

export * from './components/team';
export * from './components/node';

function nextChar(c:String) {
    let returnString = '';
    let hasIncremented = false;
    for(let i = c.length - 1; i >=0; i--){
        let cur_char = '';
        if(!hasIncremented && c[i] !== 'Z'){
            cur_char = String.fromCharCode(c.charCodeAt(i) + 1);
            hasIncremented = true;
        } else if(c[i] === 'Z'){
            cur_char = 'A';
        } else{
            cur_char = c[i];
        }
        returnString = cur_char + returnString;
    }
    if(hasIncremented === false){
        returnString += 'A';
    }
    return returnString;
}

export interface bracket_constructor {
    type?:"Single";
    teams?:team.Team[];
    best_of?:number;
}

export interface bracket_teams{
    [key:string]:team.Team;
}

export class Bracket {
    type:"Single";
    teams:bracket_teams;
    team_count:number;
    rounds:number;
    final_node:node.Node;
    default_best_of:number;
    
    constructor({type="Single", teams = [], best_of=1}:bracket_constructor={}){
        this.type = type;
        this.default_best_of = best_of;

        this.teams = {};
        for(let team of teams){
            this.teams[team.name] = team;
        }

        this.update_bracket_nodes_and_seeding();
    }

    toString() { //returns this bracket strigified, but ignores "next" node to remove circular references
        let cache:any[] = [];
        return JSON.stringify(this, function (key, value) {
            if (typeof value === 'object' && value !== null) {
                if (key === 'next_node') {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        })
    }

    add_team(team:team.Team){
        this.teams[team.name] = team;
    }

    get_round(round:number):node.Node[] | Error{
        if(this.rounds < round){
            return new Error("Input round out of bounds. Current number of rounds: " + this.rounds);
        }
        let round_out:node.Node[] = [];
        let branch = (node:node.Node) => {
            if(node.round === round){
                round_out.push(node);
            } else {
                if(node.upper_node !== null){
                    branch(node.upper_node);
                }
                if(node.lower_node !== null){
                    branch(node.lower_node);
                }
            }
        }
        branch(this.final_node);
        return round_out;
    }

    get_node(name:string){
        let round = parseInt(name);
        let rnd = this.get_round(round);
        if(rnd instanceof Error){
            return rnd;
        }
        for(let node of rnd){
            if(node.name === name){
                return node;
            }
        }
    }

    set_round_best_of(round:number,best_of:number){
        let rnd = this.get_round(round);
        if(rnd instanceof Error){
            return rnd;
        }
        for(let node of rnd){
            node.best_of = best_of;
        }
    }

    update_bracket_nodes_and_seeding(){
        let total_rounds = 0;
        this.team_count = Object.keys(this.teams).length;
        while(2**total_rounds < this.team_count){
            total_rounds++;
        }
        this.rounds = total_rounds;

        this.final_node = new node.Node({name:this.rounds + "A", best_of:this.default_best_of})

        let teams_sorted = Object.values(this.teams);
        teams_sorted.sort(function(a,b){
            return a.seed - b.seed;
        });

        var upper_team_count = 2 ** (this.rounds - 1);
        var lower_team_count = teams_sorted.length - upper_team_count;
        if(lower_team_count > 0){
            var lower_teams = teams_sorted.slice(upper_team_count);
            var upper_teams = teams_sorted.slice(0, upper_team_count);
            var lower_upper_teams = upper_teams.slice(upper_teams.length - lower_teams.length);
        }

        if(this.type === "Single"){
            let names:string[] = ['A'];
            for(let i = 0; i < this.team_count; i++){
                names.push(nextChar(names[names.length-1]));
            }
            let recurse = (depth:number, current_node:node.Node, upper_team:team.Team) => {
                current_node.round = this.rounds - depth + 1;
                let cur_num = current_node.round;
                let cur_letter = '';
                for(let i = current_node.name.length-1; i > 0; i--){
                    if(current_node.name.charCodeAt(i) >= 'A'.charCodeAt(0) && current_node.name.charCodeAt(i) <= 'Z'.charCodeAt(0)){
                        cur_letter = current_node.name[i] + cur_letter;
                    } else{
                        break;
                    }
                }
                let next_letter = names[0];
                current_node.team_upper = upper_team;
                let lower_team = teams_sorted[2**depth - upper_team.seed];
                current_node.team_lower = lower_team;
                depth++;
                if(depth < this.rounds || (lower_team_count === 0 && depth === this.rounds)){
                    if(upper_team.seed <= 2**(depth-1)/2){
                        current_node.upper_node = new node.Node({best_of:this.default_best_of});
                        current_node.upper_node.next_node = current_node;
                        recurse(depth, current_node.upper_node, upper_team);
                        current_node.team_upper = null;
                    }
                    if(lower_team.seed >= 2**(depth-1)/2){
                        current_node.lower_node = new node.Node({best_of:this.default_best_of})
                        current_node.lower_node.next_node = current_node;
                        recurse(depth, current_node.lower_node, lower_team);
                        current_node.team_lower = null;
                    }
                } else if(depth < this.rounds + 1){
                    if(lower_upper_teams !== undefined){
                        let index = lower_upper_teams.indexOf(current_node.team_lower);
                        if(index >= 0){
                            current_node.lower_node = new node.Node({best_of: this.default_best_of});
                            current_node.lower_node.team_upper = current_node.team_lower;
                            current_node.lower_node.team_lower = lower_teams[lower_teams.length - index - 1];
                            current_node.lower_node.round = 1;
                            current_node.team_lower = null;
                            current_node.lower_node.next_node = current_node;
                        }
                    }
                }
            }
            recurse(1, this.final_node, teams_sorted[0]);
            if(this.team_count < 2**this.rounds){
                let round = this.get_round(2);
                if(!(round instanceof Error)){
                    for(let node of round){
                        node.name = node.round + names[0];
                        let set_names = (n:node.Node) => {
                            if(n.next_node !== null && n.next_node.upper_node !== null && n.next_node.upper_node.name === n.name){
                                n.next_node.name = n.next_node.round + names[0];
                                set_names(n.next_node);
                            }
                        }
                        set_names(node);
                        names = names.slice(1);
                    }
                }
                round = this.get_round(1);
                if(!(round instanceof Error)){
                    for(let node of round){
                        node.name = node.round + names[0];
                        names = names.slice(1);
                    }
                }

            } else{
                let round = this.get_round(1);
                if(!(round instanceof Error)){
                    for(let node of round){
                        node.name = node.round + names[0];
                        let set_names = (n:node.Node) => {
                            if(n.next_node !== null && n.next_node.upper_node !== null && n.next_node.upper_node.name === n.name){
                                n.next_node.name = n.next_node.round + names[0];
                                set_names(n.next_node);
                            }
                        }
                        set_names(node);
                        names = names.slice(1);
                    }
                }
            }
        }

        if(this.rounds > 0){
            for(let i = 1; i <= this.rounds; i++){
                let round = this.get_round(i);
                if(!(round instanceof Error)){
                    for(let node of round){
                        if(node.team_upper !== null && node.team_upper.rounds.length > 0){
                            let this_location_results = node.team_upper.rounds.find((element)=>{
                                if(element.bracket_location === node.name){
                                    return true;
                                }
                                return false;
                            })
                            if(this_location_results !== undefined){
                                for(let j = 0; j < this_location_results.wins; j++){
                                    node.declare_single_win("upper");
                                }
                            }
                        }
                        if(node.team_lower !== null && node.team_lower.rounds.length > 0){
                            let this_location_results = node.team_lower.rounds.find((element)=>{
                                if(element.bracket_location === node.name){
                                    return true;
                                }
                                return false;
                            })
                            if(this_location_results !== undefined){
                                for(let j = 0; j < this_location_results.wins; j++){
                                    node.declare_single_win("lower");
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}