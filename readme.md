# node-tourcms

Node wrapper for the [TourCMS](http://www.tourcms.com/) [API](http://www.tourcms.com/support/api/mp/).

## Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [API methods](#api-methods)
  * [General / Housekeeping APIs](#general--housekeeping-apis)
    * [API Rate Limit Status](#api-rate-limit-status)
    * [Generic API request](#generic-api-request)
    * [List staff members](#list-staff-members)
  * [Channel APIs](#channel-apis)
    * [List Channels](#list-channels)
    * [Show Channel](#show-channel)
    * [Channel Performance](#channel-performance)
  * [Tour (Product) APIs](#tour-product-apis)
    * [Search Tours](#search-tours)
    * [List Tours](#list-tours)
    * [Show Tour](#show-tour)
    * [Update Tour](#update-tour)
    * [Show Tour Dates and Deals](#show-tour-dates-and-deals)
    * [Departures Overview](#departures-overview)
    * [Show Departure](#show-departure)
    * [Update Departure](#update-departure)
    * [Check Tour Availability](#check-tour-availability)
    * [Check Option Availability](#check-option-availability)
    * [Show Promo Code](#show-promo-code)
  * [Booking APIs](#booking-apis)
    * [Search bookings](#search-bookings)
    * [Show booking](#show-booking)
    * [Get Booking Key Redirect](#get-booking-key-redirect)
    * [Start New Booking](#start-new-booking)
    * [Commit Booking](#commit-booking)
    * [Update Booking](#update-booking)
    * [Add note to Booking](#add-note-to-booking)
    * [Cancel Booking](#cancel-booking)
    * [Delete Booking](#delete-booking)
    * [Add Booking Component](#add-booking-component)
    * [Remove Booking Component](#remove-booking-component)
    * [Update Booking Component](#update-booking-component)
    * [Send Booking Email](#send-booking-email)
  * [Voucher APIs](#voucher-apis)
    * [Search Vouchers](#search-vouchers)
    * [Redeem Voucher](#redeem-voucher)
  * [Payment APIs](#payment-apis)
    * [Create Payment / Refund](#create-payment--refund)
    * [Create Spreedly Payment](#create-spreedly-payment)
    * [List Payments](#list-Payments)
  * [Customer &amp; Enquiry APIs](#customer--enquiry-apis)
    * [Show Customer](#show-customer)
    * [Create Customer/Enquiry](#create-customerenquiry)
    * [Search Enquiries](#search-enquiries)
    * [Update Customer](#update-customer)

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

#### Generic API request

Provides an interface for calling APIs that don't yet have a specific wrapper function.

E.g. to simulate API Rate Limit Status (above):

```js
TourCMS.genericRequest({
  channelId: 3930,
  path: '/api/rate_limit_status.xml',
  callback: function(response) {
    console.log(response);
  }
})
```
Can also provide a `verb` (default is 'GET') and `postData`, which - if provided - must be an object representing the XML data to post to the API.

#### List staff members

List of staff members connected to the channel requested. To be use only for operators, no travel agents.

http://www.tourcms.com/support/api/mp/staff_members_list.php

```js
TourCMS.listStaffMembers({
  channelId: 3930,
  callback: function(response) {
    console.log(response);
  }
})
```

### Channel APIs

#### List Channels

List the Channels (supplier brands) connected, to be used by Agents/Affiliates.

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

http://www.tourcms.com/support/api/mp/tours_list.php

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
TourCMS.updateTour({
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
    console.log("Found " + response.dates_and_prices.date.length + " dates.");
  }
});
```

#### Departures Overview
Gives an overview of the departures for a specific date, good starter for a "Today" type screen.

Includes the running tours, details on their departure including number of bookings & spaces.

If a `channelId` is not provided, the one passed in the initial configuration will be used.

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

#### Update Departure

Update a departure prices, spaces, special offer etc.

If a `channelId` is not provided, the one passed in the initial configuration will be used.

http://www.tourcms.com/support/api/mp/tour_datesprices_dep_manage_update.php

```js
TourCMS.updateDeparture({
  departure: {
    tour_id: 6,
    departure_id: 4954,
    special_offer: {
      offer_price: 45,
      offer_note: "Early booking discount"
    }
  },
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
  channelId: 3930,
  qs: {
    id: 1,
    date: '2016-08-01',
    r1: 3
  },
  callback: function(response) {
    //Loop through each component and output its component key
    response.available_components.component.forEach(function(component) {
      console.log(component.component_key);
    });
  }
});
```

#### Check Option Availability
Check for Option availability.

If a `channelId` is not provided, the one passed in the initial configuration will be used.

http://www.tourcms.com/support/api/mp/tour_checkavail_options.php

```js
TourCMS.checkOptionAvailability({
  channelId: 3930,
  qs: {
    booking_id: 12662,
    tour_component_id: 8052295
  },
  callback: function(response) {
    //console.info(response.available_components.options.option);
    var options = [].concat(response.available_components.options.option);
    [].forEach.call(options, function(opt) {
      console.log("Option: "+opt.option_name);
      [].forEach.call(opt.quantities_and_prices.selection, function(sel) {
        console.log("   Quantities possible: "+sel.quantity);
      });
    });
  }
});
```

#### Show Promo Code
Get details on a promotional code. Useful for checking whether a promo code is valid for a certain channel, and if so, whether a membership number or similar is required to verify the promo.

If a `channelId` is not provided, the one passed in the initial configuration will be used.

http://www.tourcms.com/support/api/mp/promo_show.php

The following example tries to show promo code 'TENPERCENT' on Channel 3930.
```js
TourCMS.showPromo({
  channelId: 3930,
  promo: 'TENPERCENT',
  callback: function(response) {
    console.log(response);
  }
});
```

### Booking APIs

#### Search bookings

http://www.tourcms.com/support/api/mp/booking_search.php

The following example searches for bookings made in the first two weeks of January 2016.

```js
TourCMS.searchBookings({
  channelId: 3930,
  qs: {
    made_date_start: "2016-01-01",
    made_date_end: "2016-01-14"
  },
  callback: function(response) {
    console.log(response);
  }
});
```

#### Show booking

http://www.tourcms.com/support/api/mp/booking_show.php

```js
TourCMS.showBooking({
  bookingId: 8449,
  callback: function(response) {
    console.log(response.booking);
  }
});
```

#### Get Booking Key Redirect

Get a URL for use in retrieving a new booking key, ensures marketplace data (clicks, referrer) is maintained on the final booking / customer record.

Only for use by Tour Operators (mandatory step), not required when the API is being used by Marketplace Agents.

http://www.tourcms.com/support/api/mp/booking_getkey.php

```js
TourCMS.getBookingRedirectUrl({
  responseUrl: "http://www.example.com",
  callback: function(response) {
    console.log(response);
  }
});
```

#### Start New Booking

Create a temporary booking, holding off stock for the customer

http://www.tourcms.com/support/api/mp/booking_start_new.php

If a `channelId` is not provided, the one passed in the initial configuration will be used.

```js
TourCMS.startNewBooking({
  channelId: 3930,
  booking: {
    booking_key: "BOOKING_KEY_HERE",
    total_customers: 1,
    components: {
      component: [
        {
          component_key: "COMPONENT_KEY_HERE",
        }
      ]
    }
  },
  callback: function(response) {
    console.log(response);
  }
});
```

#### Commit Booking

Convert a temporary booking created with Start new booking into a live booking

http://www.tourcms.com/support/api/mp/booking_commit_new.php

If a `channelId` is not provided, the one passed in the initial configuration will be used.

The following example commits booking 1234 and suppresses sending of any email that would usually trigger

```js
TourCMS.commitBooking({
  channelId: 3930,
  booking: {
    booking_id: 1234,
    suppress_email: 1
  },
  callback: function(response) {
    console.log(response);
  }
});
```

#### Update Booking

http://www.tourcms.com/support/api/mp/booking_update.php

If a `channelId` is not provided, the one passed in the initial configuration will be used.

```js
TourCMS.updateBooking({
  channelId: 3930,
  booking: {
    booking_id: 1234,
    customer_special_request: "Please can we have a ground floor room"
  },
  callback: function(response) {
    console.log(response);
  }
});
```

#### Add note to Booking

http://www.tourcms.com/support/api/mp/booking_note_new.php

The following example will add a note "Building Node wrapper" of type AUDIT to booking 8451 on Channel 3930.

If a `channelId` is not provided, the one passed in the initial configuration will be used.

```js
TourCMS.addNoteToBooking({
  channelId: 3930,
  booking: {
    booking_id: 8451,
    note: {
        type: "AUDIT",
        text: "Building Node wrapper"
    }
  },
  callback: function(response) {
    console.log(response);
  }
});
```

#### Cancel Booking

Cancel a non-temporary booking (to remove temporary bookings use "Delete booking")

http://www.tourcms.com/support/api/mp/booking_cancel.php

If a `channelId` is not provided, the one passed in the initial configuration will be used.

The following example cancels booking 8451 on Channel 3930 while adding a note explaining the reason.

```js
TourCMS.cancelBooking({
  channelId: 3930,
  booking: {
    booking_id: 8451,
    note: "Building Node wrapper"
  },
  callback: function(response) {
    console.log(response);
  }
});
```

#### Delete Booking

Delete a temporary booking

http://www.tourcms.com/support/api/mp/booking_delete.php

If a `channelId` is not provided, the one passed in the initial configuration will be used.

```js
TourCMS.deleteBooking({
  channelId: 3930,
  bookingId: 8452,
  callback: function(response) {
    console.log(response);
  }
});
```

#### Add booking component

Add a Tour (with or without Options) to a booking, or add Options to an existing Tour that is already on a booking.

http://www.tourcms.com/support/api/mp/booking_add_component.php

If a `channelId` is not provided, the one passed in the initial configuration will be used.

```js
TourCMS.addBookingComponent({
  channelId: 3930,
  booking: {
    booking_id: 12920,
    component: {
      component_key: 'Rjqb+vKn6H5rawI+mt/m56vQ9P6ju1aKv2XO9gZ2OxykgCsUAbrdap/7CTxDKl+p'
    }
  },
  callback: function(response) {
    console.info(response);
  }
});
```

#### Remove booking component

Remove a tour from a regular (i.e. non-temporary, non-archived) booking.

http://www.tourcms.com/support/api/mp/booking_remove_component.php

If a `channelId` is not provided, the one passed in the initial configuration will be used.

```js
TourCMS.removeBookingComponent({
  channelId: 3930,
  booking: {
    booking_id: 12920,
    component: {
        component_id: 8286001
    }
  },
  callback: function(response) {
    console.info(response);
  }
});
```

#### Update booking component

Change some details of a particular booking component (tour/option/fee).

http://www.tourcms.com/support/api/mp/booking_update_component.php

If a `channelId` is not provided, the one passed in the initial configuration will be used.

```js
TourCMS.updateBookingComponent({
  channelId: 3930,
  booking: {
    booking_id: 12920,
    component: {
        component_id: 8286216,
        sale_quantity: 3
    }
  },
  callback: function(response) {
    console.info(response);
  }
});
```

#### Send booking email

Send one of the pre-configured email templates.

http://www.tourcms.com/support/api/mp/booking_send_email.php

If a `channelId` is not provided, the one passed in the initial configuration will be used.

```js
TourCMS.sendBookingEmail({
  channelId: 3930,
  booking: {
    booking_id: 12920,
    email_type: 1
  },
  callback: function(response) {
    console.info(response);
  }
});
```

### Voucher APIs

http://www.tourcms.com/support/api/mp/voucher_redemption.php

#### Search Vouchers

Get a list of bookings and any of their components that are due to start today that match a voucher barcode. Response includes keys that can be used to redeem the voucher.

If a `channelId` is not provided, the one passed in the initial configuration will be used.

http://www.tourcms.com/support/api/mp/voucher_search.php

The following example matches bookings with a voucher string, booking ID or agent ref matching the text "VOUCHER_STRING_HERE" on Channel 3930 and wideDates enabled (by default the API only searches for bookings for today).

```js
TourCMS.searchVouchers({
  channelId: 3930,
  voucherString: "VOUCHER_STRING_HERE",
  wideDates: 1,
	callback: function(response) {
		console.log("Found " + response.booking.length + " bookings")
	}
});
```

#### Redeem Voucher

Redeem / check in the client on a component (tour) on a booking, optionally specify a note to store on the booking.

If a `channelId` is not provided, the one passed in the initial configuration will be used.

http://www.tourcms.com/support/api/mp/voucher_redeem.php

```js
TourCMS.redeemVoucher({
  channelId: 3930,
  key: 'jZh9eZuLQwUdEZ6FqDHmHqy4lYV6xWa5wV2iOuw1A7M=',
  note: 'Any free text regarding the redemption',
  callback: function(response, status) {
    console.log(response);
  }
});
```

### Payment APIs

#### Create Payment / Refund

Store details of a new payment on a booking sales ledger. Allows Tour Operators to integrate their own payment methods and update the TourCMS sales ledger automatically.

http://www.tourcms.com/support/api/mp/payment_create.php

This example adds a payment of value 10 in the Channel default currency to Booking 8400.

```js
TourCMS.createPayment({
  channelId: 3930,
  payment: {
    booking_id: "8400",
    payment_value: "10",
  },
  callback: function(response, status) {
    console.log(response);
  }
});
```

#### Create Spreedly Payment

Spreedly specific version of the previous method, to call this method you should have created a Spreedly payment token representing the card you wish to charge.

http://www.tourcms.com/support/api/mp/spreedly_payment_create.php

This example adds a payment of value 10 in the Channel default currency to Booking 8400 using the Spreedly payment method represented by SPREEDLY_PAYMENT_METHOD_TOKEN.

```js
TourCMS.createSpreedlyPayment({
  channelId: 3930,
  payment: {
    spreedly_payment_method: "SPREEDLY_PAYMENT_METHOD_TOKEN",
    booking_id: "8400",
    payment_value: "10",
    currency: "GBP"
  },
  callback: function(response, status) {
    console.log(response);
  }
});
```

#### List Payments

List of payments made during a specifif period and/or from staff member.

http://www.tourcms.com/support/api/mp/payments_list.php

This example shows booking id, value and currency payments.

```js
TourCMS.listPayments({
  channelId: 3930,
  qs: {
    from_date: "2018-03-23",
    to_date: "2018-03-26"
  },
  callback: function(response, status) {
    if (response.total_payments == 0)
      console.log("No payments made");
    else{
      //Loop through each component and output its component key
      response.payments.payment.forEach(function(payment) {
        console.log("Booking " + payment.booking_id + ": " + payment.payment_value + "(" + payment.payment_currency + ")");
      });
    }
  }
});
```

### Customer & Enquiry APIs

#### Show Customer

Show details on a specific customer

http://www.tourcms.com/support/api/mp/customer_show.php

If a `channelId` is not provided, the one passed in the initial configuration will be used.

```js
TourCMS.showCustomer({
  channelId: 3930,
  customerId: 3766892,
  callback: function(response) {
    console.log(response);
  }
});
```

#### Create Customer/Enquiry

For agents/affiliates only, create a new customer & enquiry in an operators account

http://www.tourcms.com/support/api/mp/enquiry_create.php

If a `channelId` is not provided, the one passed in the initial configuration will be used.

```js
TourCMS.createEnquiry({
  channelId: 3930,
  enquiry: {
    firstname: "Joe",
    surname: "Bloggs",
    email: "test@example.com",
    enquiry_type: "General enquiry",
    enquiry_detail: "Enquiry text goes here"
  },
  callback: function(response) {
    console.log(response);
  }
});
```

#### Search Enquiries

http://www.tourcms.com/support/api/mp/enquiry_search.php

If a `channelId` is not provided, the one passed in the initial configuration will be used.

The following example lists all enquiries made in the first two weeks of January.

```js
TourCMS.searchEnquiries({
  channelId: 3930,
  qs: {
    made_date_start: "2016-01-01",
    made_date_end: "2016-01-14"
  },
  callback: function(response) {
    console.log(response);
  }
});
```

#### Update Customer

Update some of the details on a customer record

http://www.tourcms.com/support/api/mp/customer_update.php

If a `channelId` is not provided, the one passed in the initial configuration will be used.

```js
TourCMS.updateCustomer({
  channelId: 3930,
  customer: {
    customer_id: "12345",
    firstname: "Joseph"
  },
  callback: function(response) {
    console.log(response);
  }
});
```
