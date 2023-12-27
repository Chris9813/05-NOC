import 'dotenv/config'
import { Server } from "./presentation/server";
import { envs } from './config/envs.plugin';



(async() => {
    main()
})();



function main() {
    // Server.start()
    console.log( envs.PORT, envs.MAILER_EMAIL, envs.MAILER_SECRET_KEY, envs.PROD );
    
}