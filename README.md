# digital-receipts
This a repo for code relating to a new way of generating and handling digital receipts in Sweden.

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


## Integrera som kvittoutgivare

## Integrera som kostnadsförare

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
The project exists on subdomains to *.digitala-kvitton.se

Shop (affär): http://shop.digitala-kvitton.se/
mail-client: http://user-email.digitala-kvitton.se/emails
User's economy system (kostnadsförning): http://user-accounting.digitala-kvitton.se/
User's economy attestation (attestering): http://user-accounting.digitala-kvitton.se/attestation

CA (tillitslogik): http://ca.digitala-kvitton.se/
Hash-registry(kvitto-hash-lagring): http://hash-registry.digitala-kvitton.se/receipts

## Trello
All progress is tracked in Trello
https://trello.com/b/cUjsyawG/digital-receipts

## Communication
Communication is done via Slack. Contact a contributor for an invite.
