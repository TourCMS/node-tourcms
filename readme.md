# node-tourcms

Node wrapper for the [TourCMS](http://www.tourcms.com/) [API](http://www.tourcms.com/support/api/mp/).

## Installation

The easiest way to install is via [npm](http://npmjs.org) which will install node-tourcms and all dependencies.

```js
npm install tourcms
```

## Usage

Require `tourcms`

```js
var TourCMSApi = require('tourcms');
```
Create a new `tourcms` API object, passing in your API credentials
```js
var TourCMS = new TourCMSApi({
    channelId: YOUR_CHANNEL_ID,
    apiKey: 'YOUR_API_KEY',
    marketplaceId: YOUR_MARKETPLACE_ID
  });
```
Then call one of the API methods below.

The wrapper uses [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) to automatically convert the response XML into a JavaScript object, some effort is also made to ensure things that might be arrays, are.

## API methods

### General / Housekeeping APIs

#### API Rate Limit Status

Check the current API rate limit status (limit is 2000 requests per channel per hour at the time of writing this readme)

http://www.tourcms.com/support/api/mp/rate_limit_status.php

```js
TourCMS.apiRateLimitStatus({
    channelId: 3930,
    callback: function(response) {
      console.log(response);
    }
  })
```

### Channel APIs

#### List Channels

List channels.

http://www.tourcms.com/support/api/mp/channels_list.php

```js
TourCMS.listChannels({
  callback: function(response) {
      console.log(response);
  }
})
```

#### Show Channel

Show details on a specific channel.

If a `channelId` is not provided, the one passed in the initial configuration will be used.

http://www.tourcms.com/support/api/mp/channel_show.php

```js
TourCMS.showChannel({
  channelId: 3930,
  callback: function(response) {
    console.log(response);
  }
})
```

#### Channel Performance

List top 50 Channels by number of unique visitor clicks (or check performance for a specific channel).

Optonally supply a `channelId` to just return a specific Channel.

http://www.tourcms.com/support/api/mp/channels_performance.php

```js
TourCMS.channelPerformance({
  channelId: 3930,
  callback: function(response) {
    console.log(response);
  }
});
```

### Tour (Product) APIs
#### Search Tours

Search Tours.

If a `channelId` is not provided, the one passed in the initial configuration will be used.

http://www.tourcms.com/support/api/mp/tour_search.php

```js
TourCMS.searchTours({
  channelId: 3930,
  qs: {
    k: 'rafting',
    order: 'price_down'
  },
  callback: function(response) {
    console.log(response);
  }
});
```

#### List Tours

List Tours, quicker and not pagenated versus Search Tours, however returns less data. Ideal for exporting from TourCMS.

If a `channelId` is not provided, the one passed in the initial configuration will be used.

http://www.tourcms.com/support/api/mp/tour_list.php

```js
TourCMS.listTours({
  channelId: 3930,
  callback: function(response) {
    console.log(response);
  }
});
```

#### Show Tour

Return details on a specific Tour.

If a `channelId` is not provided, the one passed in the initial configuration will be used.

http://www.tourcms.com/support/api/mp/tour_show.php

```js
TourCMS.showTour({
  tourId: 1,
  callback: function(response) {
    console.log(response);
  }
});
```

#### Update Tour

Update tour, currently supports updating the `tour_url` only.

If a `channelId` is not provided, the one passed in the initial configuration will be used.

http://www.tourcms.com/support/api/mp/tour_update.php

```js
TourCMS.showTour({
  tour: {
    tourId: 1,
    tour_url: '/tours/example_tour_1/'
  },
  callback: function(response) {
    console.log(response);
  }
});
```

#### Show Tour Dates and Deals
List the dates available for a specific tour.

If a `channelId` is not provided, the one passed in the initial configuration will be used.

http://www.tourcms.com/support/api/mp/tour_datesdeals_show.php

```js
TourCMS.showTourDatesDeals({
  channelId: 3930,
  tourId: 1,
  qs: {
    has_offer: 1,
    distinct_start_dates: 1
  },
  callback: function(response) {
    // Loop through and output each component
    response.available_components.component.forEach(function(item) {
      console.log(item);
    });
  }
});
```
