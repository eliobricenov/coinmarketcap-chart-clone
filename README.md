## DISCLAIMER
 
**This is a proof of concept, by any means is an attempt of commercial use.**

### Demo

[https://coinmarketcap-chart-clone.vercel.app](coinmarketcap-chart-clone.vercel.app)

### Summary

This is a clone of the financial chart from [CoinMarketCap's](https://coinmarketcap.com/currencies/bitcoin/) Bitcoin chart.

#### Tools:

- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Infragistics Ignite UI for React](https://www.infragistics.com/products/ignite-ui-react)

It was a challenge to find a charting library that could be customizable enough to achieve a similar look and feel of 
the original chart  while still abstracting the implementation of the zoom slider used in financial chart.

The infragistics library is really powerful, and it has a lot of features, but it's not free and has pretty
uncomfortable docs. Their [financial chart](https://www.infragistics.com/products/ignite-ui-react/react/components/charts/types/stock-chart) is really good and has all the features that you might need, but it's not 
customizable enough for this use case.

I decided to use standalone components from the library and build the chart from scratch. I was able to achieve a similar
look and feel, but it's not perfect. Some styling from the original chart are just not possible to achieve with the chart
library (like the slider thumbs styling and the position of the Y axis labels).

#### Improvements:

- [ ] Add red/green color to the chart based on the price change (like the original chart)
- [ ] Match the slider thumbs styling
- [ ] Match the Y axis labels position
- [ ] Match slider's range color




