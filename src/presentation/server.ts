import { LogSeverityLevel } from "../domain/entities/log.entity";
import { CheckService } from "../domain/use-cases/checks/check-service";
import { CheckServiceMultiple } from "../domain/use-cases/checks/check-service-multiple";
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-log.datasource";
import { PostgresLogDatasource } from "../infrastructure/datasources/postgres-log.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log-impl.repository";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email.service";


const fsLogRepository = new LogRepositoryImpl(
  new FileSystemDatasource()
);

const mongoDatabaseLogRepository = new LogRepositoryImpl(
  new MongoLogDatasource(),
);

const postgresDatabaseLogRepository = new LogRepositoryImpl(
  // new FileSystemDatasource()
  // new MongoLogDatasource(),
  new PostgresLogDatasource(),
);



export class Server {

    public static async start() {
        console.log('server started...');

        // enviar email

        // const emailService = new EmailService(
        //   logRepository
        // );
        // new SendEmailLogs(
        //   emailService,
        //   fileSystemLogRepository
        // ).execute(['chris@gmail.com', 'asd@gmail.com'])
        
        // emailService.sendEmail({
        //   to: 'asdf@gmail.com',
        //   subject: 'Logs de sistema',
        //   htmlBody: `
        //   <h3>Logs del sistema - NOC</h3>
        //   <p>Lorem ipsum</p>
        //   <p>velor logs adjuntos</p>
        //   `
        // })

        // emailService.sendEmailWithFileSystemLogs(
        //   ['chris@gmail.com', 'asd@gmail.com']
        // )

        // const logs = await logRepository.getLogs(LogSeverityLevel.low);
        // console.log(logs);

        // const logs = await logRepository.getLogs(LogSeverityLevel.medium);
        // console.log(logs);

        CronService.createJob(
            '*/5 * * * * *',
            () => {
              const url = 'https://google.com';
              new CheckServiceMultiple(
                [fsLogRepository, mongoDatabaseLogRepository, postgresDatabaseLogRepository],
                () => console.log(`Ok ${url}`),
                (error) => console.error(`${error} ${url}`)
              ).execute( url );
            })
    }
}
