import 'dotenv/config';

import app from './app';
import http from 'http';

const port = process.env.PORT || 3000;
const server = http.createServer(app);

/*
    initialize server
    bootstrap app
*/
server.listen(port, () => console.log(`Listening on port: ${port}`));