import { AppServerBase, AppServer } from './core/AppBase';
import { Cors, Helmet, RateLimit } from './middleware';
import { Transcriptions } from './apps/transcriptions';


@AppServer({
    Middlewares: [Cors, Helmet, RateLimit],
    Apps: [new Transcriptions()]
})
class Server extends AppServerBase {
    constructor() {
        super()
    }
}
export { Server };