import { PrismaClient } from "@prisma/client";
import { LogDatasource } from "../../domain/dataSources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";



const prismaClient = new PrismaClient();

enum LogSeverityLevelPostgres {
    low = 'LOW',
    medium = 'MEDIUM',
    high = 'HIGH'
}

export class PostgresLogDatasource implements LogDatasource {

    transformSeverity( level: LogSeverityLevel ): LogSeverityLevelPostgres {

        switch ( level ) { 
            case LogSeverityLevel.high:
                return LogSeverityLevelPostgres.high;

            case LogSeverityLevel.medium:
                return LogSeverityLevelPostgres.medium;

            case LogSeverityLevel.low:
                return LogSeverityLevelPostgres.low;
        }

    }

    async saveLog(log: LogEntity): Promise<void> {
        const { level: levelApp, message, origin } = log;
        const level = this.transformSeverity(levelApp);

        const newLog = await prismaClient.logMode.create({
            data: {
                level,
                message,
                origin,
            }
        });
        console.log('Log creado postgres', newLog);

    }

    async getLogs(severityLavelApp: LogSeverityLevel): Promise<LogEntity[]> {
        const severityLevel = this.transformSeverity(severityLavelApp)
        const logs = await prismaClient.logMode.findMany({
            where: {
                level: severityLevel
            }
        });
        return logs.map(log => LogEntity.fromObject(log) )
    }

}