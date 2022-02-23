export default {
    name: 'ready',
    run: async (client) => {
        console.log('Ready logged in as :: ' + client.user.username);
        client.manager.init(client.user.id);
    }
};