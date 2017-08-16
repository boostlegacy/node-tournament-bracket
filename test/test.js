const bracket = require('../');

let teams = [];

for(let i = 1; i <= 7; i++){
    teams.push(new bracket.Team({name:i.toString(), seed:i}))
}

let b = new bracket.Bracket({teams:teams});
console.log(b.toString());
let nodes = b.get_round(2);
for(let node of nodes){
    console.log(node.name);
}
