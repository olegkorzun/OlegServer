const EventEmitter = require('events');

class EmitterService extends EventEmitter {
    constructor () {
        super(); // 
   //     this.WRITE_FILE = "WRITE_FILE";
    //    this.READ_FILE = "READ_FILE";
    }
}

module.exports = {
    EmitterService: EmitterService
}
