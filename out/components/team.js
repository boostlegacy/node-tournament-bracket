"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Team {
    constructor({ name = "", size = 1, seed = -1, seed_type = "Approximate", rounds = [], players = [] } = {}) {
        this.name = name;
        this.size = size;
        this.seed = seed;
        this.seed_type = seed_type;
        this.rounds = rounds;
        this.players = players;
    }
}
exports.Team = Team;
//# sourceMappingURL=team.js.map