const express = require('express')
const app = express()
//const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const User = require('./models/user')
//const rateLimit = require('express-rate-limit')
//const Limiter = require('ratelimiter')
const port = 3001;

// mongoose.connect("mongodb://localhost:27017/test_back_Tictactrip",
//     {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useUnifiedTopology: true,
//     }
// );


app.use(express.json());
app.use(express.text({ type: 'text/*' }))

// const rateLimiterWord = rateLimit({
//     windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
//     max: 80000,
//     message: 'You have exceeded the 100 requests in 24 hrs limit!',
//     headers: true,
// });

// function pour pouvoir vérifier le token 
function verifyToken(req, res, next) {

    const bearerHeaders = req.headers['authorization']

    if (typeof bearerHeaders !== 'undefined') {

        const bearer = bearerHeaders.split(' ');
        const bearerToken = bearer[1]
        req.token = bearerToken
        next();

    } else {
        res.sendStatus(403)
    }
}

//pour vérifier si avec le token est valide ou non 
app.post('/api/justify', verifyToken, (req, res) => {

    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {

            res.sendStatus(403)

        } else {

            const text = "Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n’avais pas le temps de me dire: «Je m’endors.» Et, une demi-heure après, la pensée qu’il était temps de chercher le sommeil m’éveillait; je voulais poser le volume que je croyais avoir dans les mains et souffler ma lumière; je n’avais pas cessé en dormant de faire des réflexions sur ce que je venais de lire, mais ces réflexions avaient pris un tour un peu particulier; il me semblait que j’étais moi-même ce dont parlait l’ouvrage: une église, un quatuor, la rivalité de François Ier et de Charles-Quint. Cette croyance survivait pendant quelques secondes à mon réveil; elle ne choquait pas ma raison, mais pesait comme des écailles sur mes yeux et les empêchait de se rendre compte que le bougeoir n’était plus allumé. Puis elle commençait à me devenir inintelligible, comme après la métempsycose les pensées d’une existence antérieure; le sujet du livre se détachait de moi, j’étais libre de m’y appliquer ou non; aussitôt je recouvrais la vue et j’étais bien étonné de trouver autour de moi une obscurité, douce et reposante pour mes yeux, mais peut-être plus encore pour mon esprit, à qui elle apparaissait comme une chose sans cause, incompréhensible, comme une chose vraiment obscure. Je me demandais quelle heure il pouvait être; j’entendais le sifflement des trains qui, plus ou moins éloigné, comme le chant d’un oiseau dans une forêt, relevant les distances, me décrivait l’étendue de la campagne déserte où le voyageur se hâte vers la station prochaine; et le petit chemin qu’il suit va être gravé dans son souvenir par l’excitation qu’il doit à des lieux nouveaux, à des actes inaccoutumés, à la causerie récente et aux adieux sous la lampe étrangère qui le suivent encore dans le silence de la nuit, à la douceur prochaine du retour."
            console.log('text:', text.concat(text).length)


            const str = req.body || text

            const result = str.match(/.{1,80}(?!\S)/g);

            const newStr = result.join('\n');
            console.log('newStr:', newStr)


            // permet d'échapper les caractères comme les \n et \t et les \r            
            newStr.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");

            res.json({

                authData,
                text: newStr

            })

        }
    })
})


// pour générer un token
app.post('/api/token', (req, res) => {

    const email = req.body.email
    console.log('email:', email)



    jwt.sign({ email }, 'secretkey', async (err, token) => {

        await User.create({
            email
        })

        res.json({
            token
        })

    })
})



app.listen(port, () => {
    console.log(`Server started on port : ${port}`)
})
