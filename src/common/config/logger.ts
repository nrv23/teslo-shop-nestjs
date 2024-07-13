import { Logger, Injectable, Inject } from '@nestjs/common';

@Injectable()
export class LoggerConfig {

    private logger: Logger;
    constructor(@Inject('LoggerConfigString') context: string) {
        this.logger = new Logger(context);
    }

    get showLog() {
        return this.logger;
    }
}