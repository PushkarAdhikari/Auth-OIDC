import { createServer } from 'node:http';
import { createApplication } from './app';

async function main() {
    try {
        const app = createApplication();
        const server = createServer(app);
        const PORT: number = Number(process.env.PORT) || 3000;

        server.listen(PORT, () => {
            console.log(`Http server is running on PORT: ${PORT}`);
        })
    } catch (err) {
        console.error('Error starting the http server');
        throw err;
    }
}

main();