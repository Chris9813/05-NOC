import { LogModel } from "../../data/mongo";
import { LogDatasource } from "../../domain/dataSources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";



export class MongoLogDatasource implements LogDatasource {

    async saveLog(log: LogEntity): Promise<void> {
        const newLog = await LogModel.create(log);
        console.log('Mongo Log create', newLog.id );
    }

    async getLogs(severityLavel: LogSeverityLevel): Promise<LogEntity[]> {
        const logs = await LogModel.find({
            level: severityLavel,
        });
        return logs.map(log => LogEntity.fromObject(log) )
    }

}