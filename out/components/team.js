"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class team {
    constructor({ name = "", size = 1, seed = -1, seed_type = "Approximate", rounds = [] } = {}) {
        this.name = name;
        this.size = size;
        this.seed = seed;
        this.seed_type = seed_type;
        this.rounds = [];
    }
}
exports.team = team;
//# sourceMappingURL=team.js.map