# digital-receipts
This a repo for code relating to a new way of generating and handling digital receipts in Sweden.
Hosted at: https://www.digitala-kvitton.se/

Code and instructions to start the Proof of Concept on your local machine lies in the /examples/poc folder.
Instructions to integrate as an entity (receipt-publisher / -reporter) in this flow, follow the instructions in Swedish below.


# Instruktioner på svenska
Här följer en icke-teknisk beskrivning av projektet och dess olika komponenter.
Premissen är att bygga ett självreglerande system med så lite administration som möjligt. Där alla parter ges möjlighet och hålls, via olika incitament, ansvariga för att utföra sin del korrekt.

I systemet finns det två centrala APIer. Ett hash-register och en Certificate Authority.

## Hash-register
Hash-registret finns till som ett centralt register för alla kvitton (hashar) som har utfärdats. Kvitton lagras inte i fullo utan körs först genom en kryptografisk funktion, s.k [hashfunktion](https://en.wikipedia.org/wiki/Cryptographic_hash_function), som möjliggör att, med kvittodatan tillgänglig (vid en ev. kontroll), verifiera att hashen är deriverad från datan. Däremot är det inte möjligt att återskapa kvittodatan från endast hashen.

OBS. För att kunna registrera en hash i hash-registret krävs att aktören först registrerar sig i Certificate Authority (se nedan). Detta finns i förebyggande syfte för att endast tillåta seriösa aktörer. 


## CA
CA (Certificate Authority) håller publika nycklar i en databas-tabell och hur många gånger ett företag har registrerat sig i en annan databas-tabell. Utan associering. Genom att titta i den första tabellen kan vi se om ett kvitto har signerats av en aktör som har identiferat(registrerat) sig i systemet, vilket kommer ske varje gång en kvittohash hanteras. 

Tabell nummer två kommer endast användas i när någon vill utföra en kontroll för att se att aktören har använt systemet på rätt sätt.

## Integrera som kvittoutgivare
För att identifiera sig som kvittoutgivare måste aktören först registrera sig i systemet. Identifieringen vid registrering är utanför omfattningen av det här projektet, se: [scope](https://github.com/Iteam1337/digital-receipts#scope). Det som krävs vid registreringen är en lista på de (publika) nycklar som är tilltänka att användas för att signera kvitton som produceras. En godtycklig mängd nycklar kan skickas in, men aktören har ansvar över samtliga.

## Integrera som kostnadsförare

## Kontroll av aktör


## Flödet


## Scope
Registreringen för att uppnå "initial tillit" är utanför omfattningen av det här projektet, men man kan tänka sig att det skulle passa att använda en automatiserad lösning liknande bankid för att identifiera företag, men möjligheten finns såklart att även använda papperskontrakt. 

## Frequently asked questions
## Getting Started
```
The easiest way to start the repo is to go into the examples/poc folder and 
docker-compose up -d
npm run migrate
npm run install-all
npm run start:iframe
open your browser and go to http://localhost:6900
```
## Testable PoC example
The project exists on subdomains to *.digitala-kvitton.se, in full at: https://www.digitala-kvitton.se/

- Shop (affär): https://shop.digitala-kvitton.se/
- mail-client: https://user-email.digitala-kvitton.se/emails
- User's economy system (kostnadsförning): https://user-accounting.digitala-kvitton.se/
- User's economy attestation (attestering): https://user-accounting.digitala-kvitton.se/attestation

- CA (tillitslogik): https://ca.digitala-kvitton.se/
- Hash-registry(kvitto-hash-lagring): https://hash-registry.digitala-kvitton.se/receipts

## Trello
All progress is tracked in Trello
https://trello.com/b/cUjsyawG/digital-receipts

## Visualization
A (perhaps) more understandable visualisation of the flow can be seen in this presentation:
https://slides.com/mikaelgraborg/deck#/ slide 3-5

## Communication
Communication is done via Slack. Contact a contributor for an invite.
