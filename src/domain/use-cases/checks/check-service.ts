import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

interface CheckServicesUseCase {
    execute(url: string): Promise<boolean>;
}

type SuccessCallback = (result: boolean) => void | undefined;
type ErrorCallback = (error: string) => void  | undefined;


export class CheckService implements CheckServicesUseCase {

    constructor(
        private readonly logRepository: LogRepository,
        private readonly successCallback: SuccessCallback,
        private readonly errorCallback: ErrorCallback
        ) {

    }

    public async execute(url: string):Promise<boolean> {

        try {
            const req = await fetch( url );
            if (!req.ok){
                throw new Error(`Error on check servise ${ url }`);
            }
            const log = new LogEntity(`Service ${url} working`, LogSeverityLevel.low);
            this.logRepository.saveLog( log );
            this.successCallback && this.successCallback(true);
            return true
        } catch (error) {
            const errorMessage = `${error} ${url}`
            const log = new LogEntity(errorMessage, LogSeverityLevel.high);
            this.logRepository.saveLog( log );
            this.errorCallback && this.errorCallback(errorMessage);
            return false;
            
        }

    }


}