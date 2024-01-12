import { LogEntity, LogEntityOptions, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

interface CheckServicesMultilpleUseCase {
    execute(url: string): Promise<boolean>;
}

type SuccessCallback = (result: boolean) => void | undefined;
type ErrorCallback = (error: string) => void  | undefined;


export class CheckServiceMultiple implements CheckServicesMultilpleUseCase {

    constructor(
        private readonly logRepository: LogRepository[],
        private readonly successCallback: SuccessCallback,
        private readonly errorCallback: ErrorCallback
        ) {

    }

    private getOptions (error: boolean, message : string): LogEntityOptions {
        const options: LogEntityOptions = {
            message,
            level: error ? LogSeverityLevel.high : LogSeverityLevel.low,
            origin: 'check-service.ts'
        }
        return options;
    }

    private callLogs( log: LogEntity ) {
        this.logRepository.forEach(logRepository => {
            logRepository.saveLog(log)
        })
    }

    public async execute(url: string):Promise<boolean> {

        try {
            const req = await fetch( url );
            if (!req.ok){
                throw new Error(`Error on check servise ${ url }`);
            }
            const options = this.getOptions( false, `Service ${url} working` )
            const log = new LogEntity(options);
            this.callLogs( log );
            this.successCallback && this.successCallback(true);
            return true
        } catch (error) {
            const message = `${error} ${url}`
            const options = this.getOptions( true, message )
            const log = new LogEntity(options);
            this.callLogs( log );
            this.errorCallback && this.errorCallback(message);
            return false;
            
        }

    }


}