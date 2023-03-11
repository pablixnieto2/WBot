const express = require('express')
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

console.log(1)
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
    const PORT = 4000
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
}
console.log(2)
const flowPrincipal = addKeyword(['📷 En Madrid','fotos en madrid'])
    .addAnswer(['🌳🏰 El lugar lo escoge usted, nosotros les damos  algunas opciones donde las fotos quedan muy lindas, pero si quieres otro lugar no hay ningún problema.'],{delay: 3000,})
    .addAnswer(['Sugerencias de lugares para fotos:','- Parque Europa','- Parque Retiro','- Puerta de Alcalá','- Parque Capricho','- Parque Juan Carlos','- Palacio Real'],{delay: 2000,})
    .addAnswer(['Pide tu cita *cuanto antes* para tener *más vestidos para escoger*:','www.citas.vestidos15.es'],{delay: 7000,})

main()