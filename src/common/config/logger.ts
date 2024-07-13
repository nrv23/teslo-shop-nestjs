import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerConfig {

    private logger: Logger;
    constructor(context: string) {
        this.logger = new Logger(context);
    }

    get showLog() {
        return this.logger;
    }
}