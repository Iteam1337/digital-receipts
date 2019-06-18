const express = require('express')
const app = express()

const port = 6900

require('dotenv').config()

app.use(require('body-parser').json())
app.use(express.static('node_modules'))
app.use(express.static('public'))

app.get('/', (req, res) => {
  let introClass = req.query.intro || 'initial'
  let introDoneRoute = `${process.env.SHOP_URL}/?tutorial=true`
  let introDoneLabel = 'Börja demonstrationen'
  let dataIntro = ''
  if (introClass === "hash-registry") {
    introDoneRoute = `${process.env.MAIL_URL}/emails?tutorial=true`
    introDoneLabel = 'Till butikskundens inkorg'
    dataIntro = "Kvitto-hashen syns nu här. Utan att frånge några detaljer om kvittot i sig."
  }

  if (introClass === "hash-registry-2") {
    introClass = "hash-registry"
    introDoneRoute = null
    introDoneLabel = 'Avsluta guiden'
    dataIntro = "Nu är även kvitto-hashen kostnadsförd och listas under 'Kostnadsförda kvitto-hashar' </br> </br> Det avslutar den här guiden. </br> Självklart kan du fortsätta klicka runt."
  }

  console.log(introClass);
  console.log(introDoneRoute);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
      <link rel="stylesheet" type="text/css" href="/intro.js/introjs.css"/>
      <link rel="stylesheet" type="text/css" href="combiner.css"/>

      </head>

      <body>
      <div data-intro-group="initial" data-step="1" data-intro="Välkommen till exempel-sidan för digitala kvitton. <br>
        Den här webbplatsen ämnar till att demonstrera ett exempel-flöde för ett digitala kvitto och alla olika aktörers inblandning, från att ett digitalt kvitto genereras vid ett köp, till att det kostnadsförs.
        <br>
        <br> Vill du följa en kort demonstration av tjänsten?">
        <h2>
        Digitala kvitton
        </h2>
        <a href="github.com">Hämta</a>
        koden på github
      </div>

        <ul data-intro-group="initial" data-step="2" data-intro="Dessa fönster är de centrala komponenterna i flödet, som slutar i att en butikskund har kostnadsfört ett kvitto." style="list-style-type: none;" >
          <li style="display: inline;"><iframe src="${process.env.SHOP_URL}" width="500" height="700"></iframe></li>
          <li style="display: inline;"><iframe src="${process.env.MAIL_URL}/emails" width="1000" height="700"></iframe></li>
          <li style="display: inline;"><iframe src="${process.env.USER_ACCOUNTING_URL}/expenses" width="750" height="700"></iframe></li>
          <li style="display: inline;"><iframe src="${process.env.USER_ACCOUNTING_URL}/attestation" width="750" height="700"></iframe></li>
          <li style="display: inline;"><iframe data-position="right" data-intro-group="initial" data-step="3" data-intro="Först behöver du sätta upp förutsättningarna för att systemet ska fungera. För tillfället kan två typer av aktörs-system integrera med systemet.</br> </br>
          1. En aktör, kvittoutgivaren, som genererar, registrerar kvittot i vårt system och även utger kvitton till kund, efter en lyckad affär. Till exempel är denna aktör en faktisk butik. </br>
          2. En aktör, konteraren, som kan kontera det genererade kvittot i form av till exempel en företagsutgift och också registrerar konteringen i vårt system. Till exempel är denna aktör en anställds ekonomisystem. </br> </br>
          Du behöver registrera dig som båda dessa aktörer, för att systemet ska kunna bekräfta att endast verifierade aktörer använder systemet. </br> </br>
          I verkligheten kommer dessa registreringar ofta göras av två olika företag, men just i den här demonstrationen kommer du att agera som samtliga aktörer i systemet.
          I registreringen krävs integrations-aktörerna på ett organisationsnummer och en webbaddress som systemet kan använda för att verifiera deras identitet. </br> </br>
          Börja med att klicka på de båda registreringsknapparna för att tjänsten ska fungera korrekt. Tryck sedan på 'börja demonstrationen'" src="${process.env.CA_URL}/enroll" width="498" height="700"></iframe></li>
          <li style="display: inline;"><iframe src="${process.env.CA_URL}" width="498" height="700"></iframe></li>
          <li style="display: inline;"><iframe data-intro-group="hash-registry" data-intro="${dataIntro}" src="${process.env.HASH_REGISTRY_URL}/receipts" width="498" height="700"></iframe></li>
        </ul>
        <script type="text/javascript" src="/intro.js/intro.js"></script>
        <script type="text/javascript">

            const intro = introJs()
            intro.setOptions({'hidePrev': true, 'hideNext': true, 'showStepNumbers': false, 'skipLabel': 'Hoppa över demonstration', 'doneLabel': '${introDoneLabel}', 'nextLabel': 'Nästa'})

            setTimeout(() => {
              if (localStorage.getItem('tutorial') !== "false") {
                intro.start('${introClass}')
                intro.oncomplete(function() {
                  if ('null' !== '${introDoneRoute}') {
                    window.location.href = '${introDoneRoute}';
                  } else {
                    window.location.href = 'http://localhost:6900';
                    localStorage.setItem('tutorial', false)
                  }
                });
              }
            }, 1000)
        </script>
      </body>
    </html>

  `)
})

app.get('/simulators', (_, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>
        <ul style="list-style-type: none;">
          <li style="display: inline;"><iframe src="${process.env.USER_ACCOUNTING_URL}/attestation" width="1500" height="1500"></iframe></li>
          <li style="display: inline;"><iframe src="${process.env.CA_URL}/enroll" width="498" height="1500"></iframe></li>
          <li style="display: inline;"><iframe src="${process.env.CA_URL}" width="498" height="1500"></iframe></li>
          <li style="display: inline;"><iframe src="${process.env.HASH_REGISTRY_URL}/receipts" width="498" height="1500"></iframe></li>
        </ul>
      </body>
    </html>
  `)
})


app.listen(port, () => console.log(`Everything running on ${port}!`))