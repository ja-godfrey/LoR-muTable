Legends of Runeterra - Matchup Tables and Deck Vault
==========================================================

## Client
```
npm install
npm run dragon:all <!-- this downloads all card data (>1GB) and will take a while -->
npm run serve
```

### Server
```
npm install
nodemon
```

### Card Decoder
- Despite active pull requests, the JavaScript card decoder has not been updated in a while and Bandle City is not supported. A current workaround is to go to node_modules/runeterra/src/Faction.js and add `BC: 10` to the Factions.FACTIONS map.
- CardDecoder.js isn't updated to handle the most recent set. I've commented out lines 21-23 for the time being to prevent versioning errors