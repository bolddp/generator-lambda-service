import * as http from 'http';
import { Log } from '../utils/Log';
import app from './app';

const log = new Log('server');

const SERVER_PORT = 8080;
const server = http.createServer(app());

// Create local file system folders
server.listen(SERVER_PORT, () => {
  log.info(
    `Server listening on port ${SERVER_PORT}\r\n` +
      `Try it out at http://localhost:${SERVER_PORT}/alive`
  );
});
