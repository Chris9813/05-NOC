import 'dotenv/config'
import { Server } from "./presentation/server";
import { envs } from './config/envs.plugin';
import { MongoDatabase } from './data/mongo/init';
import { LogModel } from './data/mongo';
import { PrismaClient } from '@prisma/client';



(async() => {
    main()
})();



async function main() {
    await MongoDatabase.connect({
        mongoUrl: envs.MONGO_URL,
        dbName: envs.MONGO_DB_NAME,
    });
    // crear una coleccion = tables, documento = registro
    // const prisma = new PrismaClient();
    // const newLog = await prisma.logMode.create({
    //     data: {
    //         level: 'HIGH',
    //         message: 'Test message',
    //         origin: 'App.ts'
    //     }
    // })
    // const logs = await prisma.logMode.findMany({
    //     where: {
    //         level: 'HIGH'
    //     }
    // });
    // console.log({logs})

    // const newLog = await LogModel.create({
    //     message: 'test message Mongo 4',
    //     origin: 'App.ts',
    //     level: 'low'
    // });

    // await newLog.save();
    // console.log(newLog)
    // const logs = await LogModel.find();

    Server.start();
    
}