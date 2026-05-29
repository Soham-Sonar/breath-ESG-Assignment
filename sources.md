# Sources

## SAP — Fuel and Procurement

I researched SAP MM export formats because many companies already export procurement data as flat files. I chose CSV uploads instead of live SAP integrations because they are simpler and closer to how sustainability teams usually receive data.

The parser handles common SAP issues like:

* Different column names (English + SAP naming)
* Multiple date formats
* Unit normalization
* Basic plant mapping

Sample data contains fuel purchases like diesel, petrol, and natural gas because those map directly to emission calculations.

Main limitation: real clients often use material codes instead of names, which would require additional lookup tables.

---

## Utility — Electricity

I researched electricity bill PDFs because this is one of the most common formats facilities teams receive.

The parser extracts:

* Consumption values
* Billing dates
* Meter identifiers

I used realistic commercial electricity usage values rather than synthetic round numbers.

Main limitation: scanned PDFs and unusual layouts would likely require OCR or utility-specific parsers.

---

## Travel — Flights and Ground Transport

I looked at corporate travel exports from systems like Concur because CSV exports are much easier to support than API integrations.

The parser expects:

* Distance
* Travel class
* Travel type

Sample data uses realistic travel routes and distances to show differences between economy, business, and ground transport.

Main limitation: travel exports without distance values will fail because automatic distance calculation was not implemented.
