# StockPulse

Offline-first inventory and reorder calculator for small ecommerce sellers.

## MVP features
- SKU catalogue with on-hand quantity, reorder threshold, unit cost and selling price.
- Low-stock flags, inventory cost value and gross-margin estimate.
- CSV import/export and JSON backup.

## CSV columns
`sku,name,qty,min,cost,price,supplier`.

## Limits
Manual inventory only. No live store sync, purchase-order workflows, warehouse bins, tax/shipping/refund accounting or guaranteed profit calculations. Run a backup before importing large files.

## Run
Open `index.html` in a modern browser. No build step or dependencies.
