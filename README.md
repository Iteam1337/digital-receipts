# digital-receipts
This a repo for code relating to a new way of generating and handling digital receipts in Sweden.

Code and instructions to start the Proof of Concept on your local machine lies in the /examples/poc folder.
Instructions to integrate as an entity (receipt-publisher / -reporter) in this flow, follow the instructions in Swedish below.


# Instruktioner på svenska
Här följer en icke-teknisk beskriverning av projektet och dess olika komponenter.

## Hash-register

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
