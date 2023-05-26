const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: false
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
  console.log('Message Recevied');
  console.log(message.body);

  try {

    // Crie um objeto com os botões
    const buttons = [
      { buttonId: '1', buttonText: { displayText: 'Agarro a Bola, e deixo o Pau Entrar' }, type: 1 },
      { buttonId: '2', buttonText: { displayText: 'Pego o Pau e a bola entra' }, type: 1 },
    ];

    // Crie uma mensagem com os botões
    const buttonMessage =  {
      contentText: 'Vc é goleiro do tipo vai um Pau e uma bola no gol:',
      footerType: 1,
      buttons: buttons,
    };

    // Envie a mensagem com os botões
    const aux = await message.reply(buttonMessage);
    client.sendMessage(message.from, "oi");
      
    console.log('Mensagem Enviada do ChatGPT para o Wpp');
    console.log(aux);
  }
  catch (error) {
    console.error(`error: ${error}`);
  };
});