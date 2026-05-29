# Decisions

These are some decisions I made while building the ingestion pipeline and the reasoning behind them.

## SAP

I chose CSV exports from SAP instead of APIs because CSV uploads are simpler and closer to how sustainability teams usually receive data.

I focused only on fuel and energy related procurement (diesel, petrol, gas) because supporting all procurement categories would increase complexity significantly.

The parser handles:

* Different column names
* Multiple date formats
* Unit normalization

Records above 50,000 kg CO₂e are flagged because these are often caused by incorrect units or data entry mistakes.

---

## Utility

I chose PDF uploads because utility bills are commonly shared as PDFs rather than structured exports.

The parser extracts:

* Consumption values
* Dates
* Meter information

PDF parsing is probably the least reliable part of the pipeline because layouts vary significantly.

I ignored billing amounts, taxes, and tariff details because only energy consumption is required for emissions.

---

## Travel

I chose CSV exports instead of travel APIs because API integrations require authentication and additional setup.

Travel records are grouped into:

* Economy
* Business
* Ground transport

Trips above 5000 km are flagged to catch obvious distance errors.

---

