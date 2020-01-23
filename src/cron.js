const Config = require('./config');
const Manager = require('./manager');

class Cron {
    constructor() {
        this.config = new Config();
    }

    async init() {
        await this.config.init();
        this.manager = new Manager(this.config);
        await this.process();
    }

    async process() {
        await this.manager.check();
        setTimeout(() => this.process().catch(this.error), this.config.interval);
    }

    error(e) {
        console.error(e);
        process.exit(1);
    }
}

new Cron().init();