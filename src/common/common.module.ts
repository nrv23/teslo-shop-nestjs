import { Module } from '@nestjs/common';
import { LoggerConfig } from './config/logger';

@Module({
    providers: [
        { // configurar un provider o servicio que tenga constructor
            provide: 'LoggerConfigString',
            useValue: 'MyCustomLoggerConfig',
        },
        LoggerConfig
    ],
    exports: [
        LoggerConfig
    ]
})
export class CommonModule { }
