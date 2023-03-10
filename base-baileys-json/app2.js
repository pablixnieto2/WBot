const express = require('express')
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const app = express()
const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    /**
     * Enviar mensaje con metodos propios del provider del bot
     */
    app.post('/send-message-bot', async (req, res) => {
        await adapterProvider.sendText('34620992036@c.us', 'Mensaje desde API')
        res.send({ data: 'enviado!' })
    })
    /**
     * Enviar mensajes con metodos nativos del provider
     */
    app.post('/send-message-provider', async (req, res) => {
        const id = '34620992036@c.us'
        const templateButtons = [
            {
                index: 1,
                urlButton: {
                    displayText: ':star: Star Baileys on GitHub!',
                    url: 'https://github.com/adiwajshing/Baileys',
                },
            },
            { index: 2, callButton: { displayText: 'Call me!', phoneNumber: '+1 (234) 5678-901' } },
            {
                index: 3,
                quickReplyButton: {
                    displayText: 'This is a reply, just like normal buttons!',
                    id: 'id-like-buttons-message',
                },
            },
        ]

        const templateMessage = {
            text: "Hi it's a template message",
            footer: 'Hello World',
            templateButtons: templateButtons,
        }

        const abc = await adapterProvider.getInstance()
        await abc.sendMessage(id, templateMessage)

        res.send({ data: 'enviado!' })
    })
    const PORT = 3000
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
}

const flowDesfile = addKeyword(['desfile'])
    .addAnswer(['En *Madrid*, tenemos un desfile el 10 de Febrero de 2023.','La dirección es “Salones Venecia”, en la Calle Carolina Coronado 1 a las *20.00h*','El boleto cuesta 5€'],{delay: 2000,})
    .addAnswer(['En *Barcelona* pronto haremos también un desfile','Siguenos en nuestras redes para ser la primera en enterarte:'],{delay: 4000,})
    .addAnswer('www.instagram.com/vestidos15/',{delay: 1000,})
    .addAnswer('www.tiktok.com/@vestidos15__',{delay: 1000,})

main()

