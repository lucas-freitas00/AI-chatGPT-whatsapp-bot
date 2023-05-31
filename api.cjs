const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');

const conversationHistory = [];

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();


client.on('message', async (message) => {

    if (!(message._data.id.remote in conversationHistory)) {

        conversationHistory[message._data.id.remote] = [];

        welcomeMessage = "*Olá mero Noob nessa mundo sem Graça!* \n *O que vc quer saber hoje?* \n 1 - Quero saber um CEP \n 2 - Quero uma mensagem Motivacional"
        client.sendMessage(message.from, welcomeMessage);
        conversationHistory[message._data.id.remote].push(welcomeMessage);
    } else {
        //preenche o histórico com a mensagem recebida
        conversationHistory[message._data.id.remote].push(message.body);

        try {

            await axios.post('http://127.0.0.1:5678/webhook/api-whatsapp', { message: message.body })
                .then(response => {

                    client.sendMessage(message.from, response.data.message);
                    conversationHistory[message._data.id.remote].push(response.data.message);

                    console.log(response.data); // Exibe a resposta recebida do servidor
                })
                .catch(error => {
                    client.sendMessage(message.from, "Não entendi, repita a mensagem por gentileza!");
                    // console.error(error);
                });
        }
        catch (error) {
            client.sendMessage(message.from, "Opa não entendi, pode repetir?");
            console.error(`error: ${error}`);
        };
    }

});