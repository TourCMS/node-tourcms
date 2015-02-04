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

Search Tours by various criteria (see list below), includes a subset of the information held about each tour. Good for displaying a selection of tours to a customer.

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

Return full details on a specific Tour (i.e. more than the subset of data returned by "Search Tours").

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

#### Departures Overview
Gives an overview of the departures for a specific date, good starter for a "Today" type screen.

Includes the running tours, details on their departure including number of bookings & spaces.

If a `channelId` is not provided, the one passed in the initial configuration will be used.

http://www.tourcms.com/support/api/mp/tour_datesprices_dep_manage_show.php

```js
TourCMS.getDeparturesOverview({
  date: new Date(),
  callback: function(response) {
    console.log(response);
  }
});
```

#### Show Departure
Show a specific departure, designed for staff managing bookings, dates and prices rather than displaying to customers.

Includes the loaded rates, spaces, special offer details, bookings etc.

If a `channelId` is not provided, the one passed in the initial configuration will be used.

http://www.tourcms.com/support/api/mp/tour_datesprices_dep_manage_show.php

```js
TourCMS.showDeparture({
  channelId: 3930,
  tourId: 1,
  departureId: 8117,
  callback: function(response) {
    console.log(response);
  }
});
```

#### Check Tour Availability
Check availability for a specific date and number of people on a specific tour.

If a `channelId` is not provided, the one passed in the initial configuration will be used.

http://www.tourcms.com/support/api/mp/tour_checkavail.php

The following example checks availability for 2 people on the first rate (e.g. usually "2 Adults") on the 1st Jan 2016 on Tour ID 1, Channel 3930.

```js
TourCMS.checkTourAvailability({
  qs: {
    id: 6,
    date: '2016-01-01',
    r1: 2
  },
  callback: function(response) {

    //Loop through each component and output its component key
    response.available_components.component.forEach(function(component) {
      console.log(component.component_key);
  }
});
```
