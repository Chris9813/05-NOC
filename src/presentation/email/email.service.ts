import nodemailer from 'nodemailer'
import { envs } from '../../config/envs.plugin'
import { LogRepository } from '../../domain/repository/log.repository';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';


interface Attachement {
    filename: string;
    path: string;
}

interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachments?: Attachement[];
    // TODO attachments
}

// todo attachment

export class EmailService {

    private trasnporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY,
        }

    });

    constructor (
        private readonly logRepository: LogRepository,
    ) {

    }

    async sendEmail( options: SendMailOptions ): Promise<boolean> {
        try {
            const { to, subject, htmlBody, attachments = [] } = options;

            const sendInfomration = await this.trasnporter.sendMail({
                to: to,
                subject: subject,
                html: htmlBody,
                attachments,
            });
            const log = new LogEntity({
                level: LogSeverityLevel.low,
                message: 'Email was sent',
                origin: 'email.service.ts'
            })
            console.log("🚀 ~ file: email.service.ts:55 ~ EmailService ~ sendEmail ~ log:", log)
            this.logRepository.saveLog(log);


            return true

        } catch( error ) {
            const log = new LogEntity({
                level: LogSeverityLevel.high,
                message: 'Email not sent',
                origin: 'email.service.ts'
            })
            this.logRepository.saveLog(log);
            return false
        }

    }

    async sendEmailWithFileSystemLogs(to: string | string[]) {
        const subject = 'Logs del servidor'
        const htmlBody = `
        <h3>Logs del sistema - NOC</h3>
        <p>Lorem ipsum</p>
        <p>velor logs adjuntos</p>
        `
        const attachments: Attachement[] = [
            {"filename":"logs-all.log","path":'./logs/logs-all.log'},
            {"filename":"logs-high.log","path":"./logs/logs-high.log"},
            {"filename":"logs-medium.log","path":"./logs/logs-medium.log"}

        ]

        return this.sendEmail({
            to, subject, htmlBody, attachments
        })
        
    }
}

