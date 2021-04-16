import * as winston from "winston";
import BrowserConsole from 'winston-transport-browserconsole';

const level = "debug";
winston.configure({
    transports: [
        new BrowserConsole(
            {
                format: winston.format.simple(),
                level,
            },
        ),
    ],
});

export default winston