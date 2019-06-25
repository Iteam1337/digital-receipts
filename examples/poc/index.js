const express = require('express')
const app = express()

const port = 6900

require('dotenv').config()

app.use(require('body-parser').json())
app.use(express.static('node_modules'))
app.use(express.static('public'))

app.get('/', (req, res) => {
  let introClass = req.query.intro || 'initial'
  let introDoneRoute = `${req.protocol}://${req.get('host')}/?intro=initial2`
  let introDoneLabel = 'Börja demonstrationen'
  let dataIntro = ''

  switch (introClass) {
    case "initial2":
      introDoneRoute = `${process.env.SHOP_URL}/?tutorial=true`
      introDoneLabel = 'Till affären'
      break;
    case "hash-registry":
      introDoneRoute = `${process.env.MAIL_URL}/emails?tutorial=true`
      introDoneLabel = 'Till butikskundens inkorg'
      dataIntro = "Kvitto-hashen syns nu här. Utan att frånge några detaljer om kvittot i sig. </br> För att fortsätta flödet går vi till butikskundens inkorg"
      break;
    case "hash-registry-2":
      introClass = "hash-registry"
      introDoneRoute = null
      introDoneLabel = 'Avsluta guiden'
      dataIntro = "Nu är även kvitto-hashen kostnadsförd och listas under 'Kostnadsförda kvitto-hashar' </br> </br> Det avslutar den här guiden. </br> Självklart kan du fortsätta klicka runt."
      break;
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
        Den här är en proof of concept som består av ett antal sidor. Visat nedan i så kallade iframes.
        </br>
        För att komma åt de olika sidorna individuellt, använd följande:
        </br>
        <a href="${process.env.SHOP_URL}">
        <svg class="octicon octicon-credit-card" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 9H2V8h10v1zm4-6v9c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h14c.55 0 1 .45 1 1zm-1 3H1v6h14V6zm0-3H1v1h14V3zm-9 7H2v1h4v-1z"></path></svg>
        Affär
        </a>
        </br>

        <a href="${process.env.MAIL_URL}">
        <svg class="octicon octicon-mail" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 4v8c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H1c-.55 0-1 .45-1 1zm13 0L7 9 1 4h12zM1 5.5l4 3-4 3v-6zM2 12l3.5-3L7 10.5 8.5 9l3.5 3H2zm11-.5l-4-3 4-3v6z"></path></svg>
        Butikskundens mail
        </a>
        </br>
        <a href="${process.env.USER_ACCOUNTING_URL}">
        <svg class="octicon octicon-three-bars" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.41 9H.59C0 9 0 8.59 0 8c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zm0-4H.59C0 5 0 4.59 0 4c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zM.59 11H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1H.59C0 13 0 12.59 0 12c0-.59 0-1 .59-1z"></path></svg>
        Butikskundens företags ekonomisystem
        </a>
        </br>
        <a href="${process.env.USER_ACCOUNTING_URL}/attestation">
        <svg class="octicon octicon-tasklist" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M15.41 9H7.59C7 9 7 8.59 7 8c0-.59 0-1 .59-1h7.81c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zM9.59 4C9 4 9 3.59 9 3c0-.59 0-1 .59-1h5.81c.59 0 .59.41.59 1 0 .59 0 1-.59 1H9.59zM0 3.91l1.41-1.3L3 4.2 7.09 0 8.5 1.41 3 6.91l-3-3zM7.59 12h7.81c.59 0 .59.41.59 1 0 .59 0 1-.59 1H7.59C7 14 7 13.59 7 13c0-.59 0-1 .59-1z"></path></svg>
        Ekonomisystemets attesteringsvy
        </a>
        </br>
        <a href="${process.env.CA_URL}">
       <svg class="octicon octicon-shield" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 2l7-2 7 2v6.02C14 12.69 8.69 16 7 16c-1.69 0-7-3.31-7-7.98V2zm1 .75L7 1l6 1.75v5.268C13 12.104 8.449 15 7 15c-1.449 0-6-2.896-6-6.982V2.75zm1 .75L7 2v12c-1.207 0-5-2.482-5-5.985V3.5z"></path></svg>
        Registrerade system-integrationer (tillitslogik)
        </a>
        </br>
        <a href="${process.env.CA_URL}/enroll">
       <svg class="octicon octicon-sign-in" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7 6.75V12h4V8h1v4c0 .55-.45 1-1 1H7v3l-5.45-2.72c-.33-.17-.55-.52-.55-.91V1c0-.55.45-1 1-1h9c.55 0 1 .45 1 1v3h-1V1H3l4 2v2.25L10 3v2h4v2h-4v2L7 6.75z"></path></svg>
        Registrera som system-integration
        </a>
        </br>
        <a href="${process.env.HASH_REGISTRY_URL}/receipts">
        <svg class="octicon octicon-database" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M6 15c-3.31 0-6-.9-6-2v-2c0-.17.09-.34.21-.5.67.86 3 1.5 5.79 1.5s5.12-.64 5.79-1.5c.13.16.21.33.21.5v2c0 1.1-2.69 2-6 2zm0-4c-3.31 0-6-.9-6-2V7c0-.11.04-.21.09-.31.03-.06.07-.13.12-.19C.88 7.36 3.21 8 6 8s5.12-.64 5.79-1.5c.05.06.09.13.12.19.05.1.09.21.09.31v2c0 1.1-2.69 2-6 2zm0-4c-3.31 0-6-.9-6-2V3c0-1.1 2.69-2 6-2s6 .9 6 2v2c0 1.1-2.69 2-6 2zm0-5c-2.21 0-4 .45-4 1s1.79 1 4 1 4-.45 4-1-1.79-1-4-1z"></path></svg>
        Kvittomatchning (hash-register)
        </a>
        </br>
        </br>
        <a href="github.com">
        <svg class="octicon octicon-mark-github" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
        Mer information och se koden på github</a>
        </br>
        </br>
        <a href="javascript:enableTutorial()">
        <svg class="octicon octicon-play" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 8A7 7 0 1 1 0 8a7 7 0 0 1 14 0zm-8.223 3.482l4.599-3.066a.5.5 0 0 0 0-.832L5.777 4.518A.5.5 0 0 0 5 4.934v6.132a.5.5 0 0 0 .777.416z"></path></svg>
        Starta om guiden
        </a>
      </div>

        <ul data-intro-group="initial" data-step="2" data-intro="Dessa fönster är de centrala komponenterna i flödet, som slutar i att en butikskund har kostnadsfört ett kvitto." style="list-style-type: none;" >
          <li style="display: inline;"><iframe src="${process.env.SHOP_URL}" width="500" height="700"></iframe></li>
          <li style="display: inline;"><iframe src="${process.env.MAIL_URL}/emails" width="1000" height="700"></iframe></li>
          <li style="display: inline;"><iframe src="${process.env.USER_ACCOUNTING_URL}/expenses" width="750" height="700"></iframe></li>
          <li style="display: inline;"><iframe src="${process.env.USER_ACCOUNTING_URL}/attestation" width="750" height="700"></iframe></li>
          <li style="display: inline;"><iframe src="${process.env.CA_URL}/enroll${introClass === 'initial2' ? "?tutorial=true" : ""}" data-position="right" data-intro-group="initial2" data-step="3" data-intro="Först behöver du sätta upp förutsättningarna för att systemet ska fungera. För tillfället kan två typer av aktörs-system integrera med systemet.</br> </br>
          1. Kvittoutgivaren, som genererar, registrerar kvittot i vårt system och även utger kvitton till kund, efter en lyckad affär. Till exempel är denna aktör en faktisk butik. </br>
          2. Konteraren, som kan kontera det genererade kvittot i form av till exempel en företagsutgift och också registrerar konteringen i vårt system. Till exempel är denna aktör en anställds ekonomisystem. </br> </br>
          Du behöver registrera dig som båda dessa aktörer, för att systemet ska kunna bekräfta att endast verifierade aktörer använder systemet. </br> </br>
          I verkligheten kommer dessa registreringar ofta göras av två olika företag, men just i den här demonstrationen kommer du att agera som samtliga aktörer i systemet.
          I registreringen krävs integrations-aktörerna på ett organisationsnummer och en webbaddress som systemet kan använda för att verifiera deras identitet. </br> </br>
          Börja med att klicka på de båda registreringsknapparna för att tjänsten ska fungera korrekt. Tryck sedan på 'Till affären'" src="${process.env.CA_URL}/enroll" width="498" height="700"></iframe></li>
          <li style="display: inline;"><iframe src="${process.env.CA_URL}" width="498" height="700"></iframe></li>
          <li style="display: inline;"><iframe data-intro-group="hash-registry" data-intro="${dataIntro}" src="${process.env.HASH_REGISTRY_URL}/receipts" width="498" height="700"></iframe></li>
        </ul>
        <script type="text/javascript" src="/intro.js/intro.js"></script>
        <script type="text/javascript">
            function enableTutorial() {
              localStorage.setItem('tutorial', true)
              window.location.reload()
            }
            const intro = introJs()
            intro.setOptions({'hidePrev': true, 'hideNext': true, 'showStepNumbers': false, 'skipLabel': 'Hoppa över demonstration', 'doneLabel': '${introDoneLabel}', 'nextLabel': 'Nästa'})

            setTimeout(() => {
              if (localStorage.getItem('tutorial') !== "false") {
                intro.start('${introClass}')
                intro.oncomplete(function() {
                  if ('null' !== '${introDoneRoute}') {
                    window.location.href = '${introDoneRoute}';
                  } else {
                    localStorage.setItem('tutorial', false)
                    window.location.href = 'http://' + window.location.host;
                  }
                });
                intro.onexit(function() {
                  localStorage.setItem('tutorial', false)
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