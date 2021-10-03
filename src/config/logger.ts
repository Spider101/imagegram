import dayjs from 'dayjs';
import logger from 'pino';

export const LOG = logger({
    prettyPrint: true,
    base: {
        pid: false
    },
    timestamp: () => `,"time":"${dayjs().format()}`
});