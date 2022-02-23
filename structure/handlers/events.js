import { readdirSync } from 'fs';

const events = (client) => {
    readdirSync('./events/client').filter((file) => file.endsWith('.js')).forEach((file) => {
        import('../../events/client/' + file).then((event) => {
            event = event?.default;
            if (!event?.run) return console.log(`[Event] unable to load :: ${file}`);
            event.name = event.name || file.replace('.js', '');
            try {
                client.on(event.name, event.run.bind(null, client));
                console.log(`[Event] successfully loaded :: ${file}`);
            } catch (error) {
                console.log(`[Event] error while executing :: ${file}`);
            }
        });
    });
}

export default events;