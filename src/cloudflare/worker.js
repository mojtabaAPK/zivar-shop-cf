import { Hono } from "hono";

import { users }    from "#cloudflare/routes/users.js";
import { send_tel } from "#cloudflare/utils.js";

const app = new Hono();

app.route("/api/users", users);

export default {

    // HTTP Requests
    fetch: app.fetch,

    // Cron
    async scheduled(event, env, ctx) {        

        /* await send_tel(
            "with cron at",
            env
        ); */

    }

};