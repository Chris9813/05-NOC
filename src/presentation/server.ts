import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log-impl.repository";
import { CronService } from "./cron/cron-service";


const fileSystemLogRepository = new LogRepositoryImpl(
  new FileSystemDatasource()
);



export class Server {

    public static start() {
        console.log('server started...');
        CronService.createJob(
            '*/5 * * * * *',
            () => {
              const url = 'https://google.com';
              new CheckService(
                fileSystemLogRepository,
                () => console.log(`Ok ${url}`),
                (error) => console.error(`${error} ${url}`)
              ).execute( url );
            })
    }
}
