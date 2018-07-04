'use strict';

var https = require('https');
var crypto = require('crypto');
var querystring = require('querystring');

var concat = require('concat-stream');
var xml2js = require('xml2js');

// Constructor

function TourCMS(options) {

  // Merge the default options with the client submitted options
  this.options = {
    hostname: 'api.tourcms.com',
    apiKey: '',
    marketplaceId: 0,
    channelId: 0,
    channels: []
  };

  if(typeof options !== 'undefined') {
    // Process config
    if(typeof options.apiKey !== 'undefined')
      this.options.apiKey = options.apiKey;

    if(typeof options.marketplaceId !== 'undefined')
      this.options.marketplaceId = options.marketplaceId;

    if(typeof options.channelId !== 'undefined')
      this.options.channelId = options.channelId;
  }

}

// class methods

// Call the API
TourCMS.prototype.makeRequest = function(a) {

  var apiParams = "";

  // Sensible defaults
  if(typeof a.channelId == "undefined")
    a.channelId = 0;

  if(typeof a.verb == "undefined")
    a.verb = 'GET';

  if(typeof a.postData !== "undefined") {
    // Convert object into XML
    var builder = new xml2js.Builder();
    apiParams = builder.buildObject(a.postData);
  }

  // Get the current time
  var outboundTime = this.generateTime();

  // Generate the signature
  var signature = this.generateSignature(a.path, a.channelId, a.verb, outboundTime, this.options.apiKey);

  var options = {
    method: a.verb,
    hostname: this.options.hostname,
    path: a.path,
    headers: {
      'x-tourcms-date': outboundTime,
      'Authorization': 'TourCMS ' + a.channelId + ':' + this.options.marketplaceId + ':' + signature,
      'Content-type': 'text/xml;charset="utf-8"',
      'Content-length': Buffer.byteLength(apiParams, 'utf8')
    }
  };

  var req = https.request(options, function(response) {

    response.setEncoding("utf8");

    // Pipe to handler
    var concatStream = concat(apiResponded);
    response.pipe(concatStream);

    // Handle errors
    response.on("error", console.log);

    // Process API response
    function apiResponded(apiResponse) {
      // Convert XML to JS object
      var parser = new xml2js.Parser({explicitArray:false});
      parser.parseString(apiResponse, function (err, result) {
        // If the method processes the response, give it back
        // Otherwise call the original callback

        if(typeof a.processor !== 'undefined')
          a.processor(result.response, a.callback);
        else
          a.callback(result.response);
      });


    }

  });

  // If we're posting, let's post
  if(a.verb == "POST")
    req.write(apiParams);

  // We're done requesting
  req.end();
};

// Housekeeping

// API Rate Limit Status
TourCMS.prototype.apiRateLimitStatus = function(a) {

if(typeof a === 'undefined')
a = {};

if(typeof a.channelId === 'undefined')
  a.channelId = this.options.channelId;


  a.path = '/api/rate_limit_status.xml';

  this.makeRequest(a);

};

// Make a generic API request
TourCMS.prototype.genericRequest = function(a) {

  this.makeRequest(a);

};

// Channels

TourCMS.prototype.listChannels = function(a) {

  if(typeof a === 'undefined')
    a = {};

  a.path = '/p/channels/list.xml';

  this.makeRequest(a);
};

TourCMS.prototype.showChannel = function(a) {

    if(typeof a === 'undefined')
      a = {};

    if(typeof a.channelId === 'undefined')
      a.channelId = this.options.channelId;

    a.path = '/c/channel/show.xml';

    this.makeRequest(a);
};

TourCMS.prototype.channelPerformance = function(a) {

    if(typeof a === 'undefined')
      a = {};

    if(typeof a.channelId === 'undefined')
      a.channelId = this.options.channelId;

    a.path = '/p/channels/performance.xml';

    this.makeRequest(a);
};

// Tours

// Seach Tours
TourCMS.prototype.searchTours = function(a) {

  if(typeof a === 'undefined')
    a = {};

  // Convert/set search params
  // If undefined
  if(typeof a.qs === "undefined")
    a.qs = {};

  a.qs = querystring.stringify(a.qs);

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Set API path
  if(parseInt(a.channelId)===0)
    a.path = '/p/tours/search.xml?' + a.qs;
  else
    a.path = '/c/tours/search.xml?' + a.qs;

  // Sanitise response, total_tour_count always set
  // Tours is an array if empty

  a.processor = function(response, callback) {

    // Ensure we have a total tour count
    if(typeof response.total_tour_count === 'undefined')
      response.total_tour_count = '0';

    // Ensure we have an array of tours
    response.tour = [].concat(response.tour);

    callback(response);
  };

  this.makeRequest(a);

};

// List Tours
TourCMS.prototype.listTours = function(a) {

  if(typeof a === 'undefined')
    a = {};

  // Convert/set search params
  // If undefined
  if(typeof a.qs === "undefined")
  a.qs = {};

  a.qs = querystring.stringify(a.qs);

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Set API path
  if(a.channelId===0)
    a.path = '/p/tours/list.xml?' + a.qs;
  else
    a.path = '/c/tours/list.xml?' + a.qs;

  // Sanitise response, tours is an array if empty
  a.processor = function(response, callback) {

    // Ensure we have an array of tours
    response.tour = [].concat(response.tour);

    callback(response);

  };

  this.makeRequest(a);
};

// Show Tour
TourCMS.prototype.showTour = function(a) {

  // If QS undefined
  if(typeof a.qs === "undefined") {
    a.qs = {};
  }

  // Add in the TourId in if provided separately
  if(typeof a.tourId !== 'undefined') {
    a.qs.id = a.tourId;

  }

  // Fix id if passed in to qs directly as tourId
  if(typeof a.qs.tourId !== 'undefined') {
    a.qs.id = a.qs.tourId;
    delete a.qs.tourId;
  }

  a.qs = querystring.stringify(a.qs);

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  a.path = '/c/tour/show.xml?' + a.qs;

  this.makeRequest(a);
};


// Update Tour
TourCMS.prototype.updateTour = function(a) {

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Tour ID
  // If tour_id is provided as tourId, fix
  if(typeof a.tour.tour_id === "undefined") {
    if(typeof a.tour.tourId !== "undefined") {
      a.tour.tour_id = a.tour.tourId;
      delete a.tour.tourId;
    }
  }

  // Set post data
  a.postData = {tour: a.tour};

  // Set API path
  a.path = '/c/tour/update.xml';

  a.verb = 'POST';

  this.makeRequest(a);
};

TourCMS.prototype.showTourDatesDeals = function(a) {

  // If QS undefined
  if(typeof a.qs === "undefined")
    a.qs = {};

  // Add in the TourId in if provided separately
  if(typeof a.tourId !== 'undefined')
    a.qs.id = a.tourId;

  // Fix id if passed in to qs directly as tourId
  if(typeof a.qs.tourId !== 'undefined') {
    a.qs.id = a.qs.tourId;
    delete a.qs.tourId;
  }

  a.qs = querystring.stringify(a.qs);

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  a.path = '/c/tour/datesprices/datesndeals/search.xml?' + a.qs;

  // Sanitise response, total_date_count always set
  // Tours is an array if empty

  a.processor = function(response, callback) {

  // Ensure we have a total_date_count
  if(typeof response.total_date_count === 'undefined')
    response.total_date_count = '0';

  // Ensure we have an array of dates
  if(typeof response.dates_and_prices === 'undefined')
    response.dates_and_prices = {date:[]};
  else
    response.dates_and_prices.date = [].concat(response.dates_and_prices.date);

    callback(response);
  };

  this.makeRequest(a);
};

// Get Departures Overview
TourCMS.prototype.getDeparturesOverview = function(a) {

  if(typeof a.channelId === 'undefined')
    a.channelId = this.options.channelId;

  // Build qyery string
  var params = {};

  if(typeof a.date !== 'undefined')
    params.date = this.toTourcmsDate(a.date);

  if(typeof a.productTypes !== 'undefined')
    params.product_type = a.productTypes.join(',');

  if(typeof a.page !== 'undefined')
    params.page = a.page;

  if(typeof a.perPage !== 'undefined')
    params.per_page = a.perPage;

  a.path = '/c/tour/datesprices/dep/manage/overview.xml?' + querystring.stringify(params);

  // Sanitise response
  a.processor = function(response, callback) {

    // Check we have a tour count
    if(typeof response.total_tour_count === 'undefined')
      response.total_tour_count = 0;

    // Check we have an array of tours
    if(typeof response.tour === 'undefined')
      response.tour = [];
    else
      response.tour = [].concat(response.tour);

    // Check each tour has an array of departures
    response.tour.forEach(function(tour) {
      if(tour.departures === '')
        tour.departures = {departure:[]};
      else
        tour.departures.departure = [tour.departures.departure].concat();

    });

    callback(response);
  };

  this.makeRequest(a);
};

// Show Departure
TourCMS.prototype.showDeparture = function(a) {

  if(typeof a.channelId === 'undefined')
    a.channelId = this.options.channelId;

  a.path = '/c/tour/datesprices/dep/manage/show.xml?id=' + a.tourId + '&departure_id=' + a.departureId;

  // Sanitise response
  a.processor = function(response, callback) {

    if(typeof response.tour.bookings === 'undefined')
      response.tour.bookings = {booking:[]};
    else
      response.tour.bookings.booking = [].concat(response.tour.bookings.booking);

    callback(response);
  };

  this.makeRequest(a);

};

// Update departure
TourCMS.prototype.updateDeparture = function(a) {

  if(typeof a.channelId === 'undefined')
    a.channelId = this.options.channelId;

  a.postData = {departure: a.departure};

  a.path = '/c/tour/datesprices/dep/manage/update.xml';

  a.verb = 'POST';

  this.makeRequest(a);

};

// Check Tour Availability
TourCMS.prototype.checkTourAvailability = function(a) {

  // If QS undefined
  if(typeof a.qs === "undefined") {
    a.qs = {};
  }

  // Add in the TourId in if provided separately
  if(typeof a.tourId !== 'undefined') {
    a.qs.id = a.tourId;
  }

  // Fix id if passed in to qs directly as tourId
  if(typeof a.qs.tourId !== 'undefined') {
    a.qs.id = a.qs.tourId;
    delete a.qs.tourId;
  }

  a.qs = querystring.stringify(a.qs);

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Sanitise response
  // Ensure we have an available_components.component array
  a.processor = function(response, callback) {

    if(!response.available_components)
      response.available_components = {component:[]};
    else
      response.available_components.component = [].concat(response.available_components.component);

    // Ensure each components contents are correct
    response.available_components.component.forEach(function(component) {
      // Price rows
      component.price_breakdown.price_row = [].concat(component.price_breakdown.price_row);

      // Options
      if(typeof component.options === 'string' || typeof component.options === 'undefined')
        component.options = {option:[]};
      else {
        component.options["option"] = [].concat(component.options["option"]);
      }

      // Pickups
      if(typeof component.pickup_points === 'undefined')
          component.pickup_points = {pickup:[]};
        else
          component.pickup_points.pickup = [].concat(component.pickup_points.pickup);
    });

    callback(response);
  };

  a.path = '/c/tour/datesprices/checkavail.xml?' + a.qs;

  this.makeRequest(a);
};

// Check Tour Availability
TourCMS.prototype.checkOptionAvailability = function(a) {

  if(typeof a === 'undefined')
    a = {};

  // If QS undefined
  if(typeof a.qs === "undefined") {
      a.qs = {};
  }

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  a.qs = querystring.stringify(a.qs);

  a.path = '/c/booking/options/checkavail.xml?' + a.qs;

  this.makeRequest(a);
};

// Show Promo
TourCMS.prototype.showPromo = function(a) {

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  a.path = '/c/promo/show.xml?promo_code=' + a.promo;

  this.makeRequest(a);

};


// Bookings

// Seach Bookings
TourCMS.prototype.searchBookings = function(a) {

  if(typeof a === 'undefined')
    a = {};

  // Convert/set search params
  // If undefined
  if(typeof a.qs === "undefined")
    a.qs = {};

  a.qs = querystring.stringify(a.qs);

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Set API path
  if(parseInt(a.channelId)===0)
    a.path = '/p/bookings/search.xml?' + a.qs;
  else
    a.path = '/c/bookings/search.xml?' + a.qs;

  // Sanitise response, total_tour_count always set
  // Tours is an array if empty

  a.processor = function(response, callback) {

    // Ensure we have a total tour count
    if(typeof response.total_bookings_count === 'undefined')
      response.total_bookings_count = '0';

    // Ensure we have an array of tours
    response.booking = [].concat(response.booking);

    callback(response);
  };

  this.makeRequest(a);

};

// Show booking
TourCMS.prototype.showBooking = function(a) {

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  a.path = '/c/booking/show.xml?booking_id=' + a.bookingId;

  // Sanitise response, tours is an array if empty
  a.processor = function(response, callback) {

    if(response.error == "OK" && response.booking){

      // Ensure we have an array of customers
      if(typeof response.booking.customers !== "undefined")
        response.booking.customers.customer = [].concat(response.booking.customers.customer);
      else
        response.booking.customers = {customer:[]};

      // Ensure we have an array of payments
      if(typeof response.booking.payments !== "undefined")
        response.booking.payments.payment = [].concat(response.booking.payments.payment);
      else
        response.booking.payments = {payment:[]};

      // Ensure we have an array of custom fields
      if(typeof response.booking.custom_fields !== "undefined")
        response.booking.custom_fields.field = [].concat(response.booking.custom_fields.field);
      else
        response.booking.custom_fields = {field:[]};

    }

    callback(response);

  };

  this.makeRequest(a);
};

// Get booking redirect url
TourCMS.prototype.getBookingRedirectUrl = function(a) {

  if(typeof a === "undefined") {
    a = {};
  }

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Build object that will be turned into XML
  a.postData = ({
    url: {
      response_url: a.responseUrl
    }
  });

  // Set API path
  a.path = '/c/booking/new/get_redirect_url.xml';

  // POST
  a.verb = 'POST';

  this.makeRequest(a);
};

// Start New Booking
TourCMS.prototype.startNewBooking = function(a) {

  if(typeof a === "undefined")
    a = {};

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Booking object, create empty one if it doesn't exist
  if(typeof a.booking === "undefined")
    a.booking = {};

  // Build object that will be turned into XML
  a.postData = ({
    booking: a.booking,
  });

  // Set API path
  a.path = '/c/booking/new/start.xml';

  // POST
  a.verb = 'POST';

  // Sanitise response, customers is an array
  a.processor = function(response, callback) {

    // Ensure we have an array of custom fields
    if(response.error == "OK" && response.booking){
      if(typeof response.booking.customers !== "undefined")
        response.booking.customers.customer = [].concat(response.booking.customers.customer);
      else
        response.booking.customers = {customer:[]};
    }

    callback(response);

  };

  this.makeRequest(a);

};

// Commit Booking
TourCMS.prototype.commitBooking = function(a) {

  if(typeof a === "undefined")
    a = {};

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Booking object, create empty one if it doesn't exist
  if(typeof a.booking === "undefined")
    a.booking = {};

  // Build object that will be turned into XML
  a.postData = ({
    booking: a.booking,
  });

  // Set API path
  a.path = '/c/booking/new/commit.xml';

  // POST
  a.verb = 'POST';

  this.makeRequest(a);

};

// Update Booking
TourCMS.prototype.updateBooking = function(a) {

  if(typeof a === "undefined")
    a = {};

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Booking object, create empty one if it doesn't exist
  if(typeof a.booking === "undefined")
    a.booking = {};

  // Build object that will be turned into XML
  a.postData = ({
    booking: a.booking,
  });

  // Set API path
  a.path = '/c/booking/update.xml';

  // POST
  a.verb = 'POST';

  this.makeRequest(a);

};

// Add Note To Booking
TourCMS.prototype.addNoteToBooking = function(a) {

  if(typeof a === "undefined")
    a = {};

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Booking object, create empty one if it doesn't exist
  if(typeof a.booking === "undefined")
    a.booking = {};

  // Build object that will be turned into XML
  a.postData = ({
    booking: a.booking,
  });

  // Set API path
  a.path = '/c/booking/note/new.xml';

  // POST
  a.verb = 'POST';

  this.makeRequest(a);

};

// Cancel Booking
TourCMS.prototype.cancelBooking = function(a) {

  if(typeof a === "undefined")
    a = {};

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Booking object, create empty one if it doesn't exist
  if(typeof a.booking === "undefined")
    a.booking = {};

  // Build object that will be turned into XML
  a.postData = ({
    booking: a.booking,
  });

  // Set API path
  a.path = '/c/booking/cancel.xml';

  // POST
  a.verb = 'POST';

  this.makeRequest(a);

};

// Delete Booking
TourCMS.prototype.deleteBooking = function(a) {

  if(typeof a === "undefined")
    a = {};

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Set API path
  a.path = '/c/booking/delete.xml?booking_id=' + a.bookingId;

  // POST
  a.verb = 'POST';

  this.makeRequest(a);

};

// Booking components
TourCMS.prototype.addBookingComponent = function(a) {

    if(typeof a === "undefined")
    a = {};

    // Channel ID
    // If undefined, use object level channelId
    if(typeof a.channelId === "undefined")
      a.channelId = this.options.channelId;

    // Set post data
    a.postData = ({
      booking: a.booking,
    });

    // Set API path
    a.path = '/c/booking/component/new.xml';

    // POST
    a.verb = 'POST';

    this.makeRequest(a);

};

// Remove a component from a booking
TourCMS.prototype.removeBookingComponent = function(a) {

  if(typeof a === "undefined")
    a = {};

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Set post data
  a.postData = ({
    booking: a.booking,
  });

  // Set API path
  a.path = '/c/booking/component/delete.xml';

  // POST
  a.verb = 'POST';

  this.makeRequest(a);

};

// Update a component from a booking
TourCMS.prototype.updateBookingComponent = function(a) {

  if(typeof a === "undefined")
    a = {};

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Set post data
  a.postData = ({
    booking: a.booking,
  });

  // Set API path
  a.path = '/c/booking/component/update.xml';

  // POST
  a.verb = 'POST';

  this.makeRequest(a);

};

// Trigger booking email
TourCMS.prototype.sendBookingEmail = function(a) {

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Set post data
  a.postData = ({
    booking: a.booking,
  });

  // Set API path
  a.path = '/c/booking/email/send.xml';

  // POST
  a.verb = 'POST';

  this.makeRequest(a);
};

// Vouchers

// Search voucher
TourCMS.prototype.searchVouchers = function(a) {

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Voucher string to search
  if(typeof a.voucherString === "undefined")
    a.voucherString = '';

  // Build object that will be turned into XML
  a.postData = ({
    voucher: {
      barcode_data: a.voucherString
    }
  });

  // If we're searching wide dates, add that on
  if(typeof a.wideDates != 'undefined') {
    a.postData.voucher.wide_dates = a.wideDates;
  }

  // Set API path
  if(parseInt(a.channelId)===0)
    a.path = '/p/voucher/search.xml';
  else
    a.path = '/c/voucher/search.xml';

  // POST
  a.verb = 'POST';

  this.makeRequest(a);
};

// Redeem voucher
TourCMS.prototype.redeemVoucher = function(a) {

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Voucher key to redeem (obtained from "Search Vouchers")
  if(typeof a.key === "undefined")
    a.key = '';

  // Optionally add a note to the booking
  if(typeof a.note === "undefined")
    a.note = '';

  // Build object that will be turned into XML
  a.postData = ({
    voucher: {
      key: a.key,
      note: a.note
    }
  });

  // Set API path
  a.path = '/c/voucher/redeem.xml';

  // POST
  a.verb = 'POST';

  this.makeRequest(a);

};

// Payments

// Create payment
TourCMS.prototype.createPayment = function(a) {

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Payment object, create empty one if it doesn't exist
  if(typeof a.payment === "undefined")
    a.payment = {};

  // Build object that will be turned into XML
  a.postData = ({
    payment: a.payment,
  });

  // Set API path
  a.path = '/c/booking/payment/new.xml';

  // POST
  a.verb = 'POST';

  this.makeRequest(a);

};

// Create payment
TourCMS.prototype.createSpreedlyPayment = function(a) {

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Payment object, create empty one if it doesn't exist
  if(typeof a.payment === "undefined")
    a.payment = {};

  // Build object that will be turned into XML
  a.postData = ({
    payment: a.payment,
  });

  // Set API path
  a.path = '/c/booking/payment/spreedly/new.xml';

  // POST
  a.verb = 'POST';

  this.makeRequest(a);

};

// Seach Enquiries
TourCMS.prototype.listPayments = function(a) {

  if(typeof a === 'undefined')
    a = {};

  // Convert/set search params
  // If undefined
  if(typeof a.qs === "undefined")
    a.qs = {};

  a.qs = querystring.stringify(a.qs);

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  a.path = '/c/booking/payment/list.xml?' + a.qs;

  // Sanitise response, total_enquiries_count always set
  // Enquiries is an array if empty

  a.processor = function(response, callback) {

    // Ensure we have a total tour count
    if(typeof response.total_payments === 'undefined')
      response.total_payments = '0';
    else
      // Ensure we have an array of tours
      response.payment = [].concat(response.payment);

    callback(response);
    
  };

  this.makeRequest(a);

};


// Seach Enquiries
TourCMS.prototype.listStaffMembers = function(a) {

  if(typeof a === 'undefined')
    a = {};

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  a.path = '/c/staff/list.xml';

  // Sanitise response, total_enquiries_count always set
  // Enquiries is an array if empty

  a.processor = function(response, callback) {

    // Ensure we have a total tour count
    if(typeof response.total_users === 'undefined')
      response.total_users = '0';
    else
      response.users.user = [].concat(response.users.user);

    callback(response);
    
  };

  this.makeRequest(a);

};
// Customers

// Show Customer
TourCMS.prototype.showCustomer = function(a) {

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  a.path = '/c/customer/show.xml?customer_id=' + a.customerId;

  // Sanitise response, tours is an array if empty
  a.processor = function(response, callback) {

    // Ensure we have an array of custom fields
    if(typeof response.customer.custom_fields !== "undefined")
      response.customer.custom_fields.field = [].concat(response.customer.custom_fields.field);
    else
      response.customer.custom_fields = {field:[]};

    callback(response);

  };

  this.makeRequest(a);
};

// Create Enquiry
TourCMS.prototype.createEnquiry = function(a) {

  if(typeof a === "undefined")
    a = {};

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Enquiry object, create empty one if it doesn't exist
  if(typeof a.enquiry === "undefined")
    a.enquiry = {};

  // Build object that will be turned into XML
  a.postData = ({
    enquiry: a.enquiry,
  });

  // Set API path
  a.path = '/c/enquiry/new.xml';

  // POST
  a.verb = 'POST';

  this.makeRequest(a);

};

// Seach Enquiries
TourCMS.prototype.searchEnquiries = function(a) {

  if(typeof a === 'undefined')
    a = {};

  // Convert/set search params
  // If undefined
  if(typeof a.qs === "undefined")
    a.qs = {};

  a.qs = querystring.stringify(a.qs);

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Set API path
  if(parseInt(a.channelId)===0)
    a.path = '/p/enquiries/search.xml?' + a.qs;
  else
    a.path = '/c/enquiries/search.xml?' + a.qs;

  // Sanitise response, total_enquiries_count always set
  // Enquiries is an array if empty

  a.processor = function(response, callback) {

    // Ensure we have a total tour count
    if(typeof response.total_enquiries_count === 'undefined')
      response.total_enquiries_count = '0';

    // Ensure we have an array of tours
    response.enquiry = [].concat(response.enquiry);

    callback(response);
  };

  this.makeRequest(a);

};

// Update Customer
TourCMS.prototype.updateCustomer = function(a) {

  if(typeof a === "undefined")
    a = {};

  // Channel ID
  // If undefined, use object level channelId
  if(typeof a.channelId === "undefined")
    a.channelId = this.options.channelId;

  // Enquiry object, create empty one if it doesn't exist
  if(typeof a.customer === "undefined")
    a.customer = {};

  // Build object that will be turned into XML
  a.postData = ({
    customer: a.customer,
  });

  // Set API path
  a.path = '/c/customer/update.xml';

  // POST
  a.verb = 'POST';

  this.makeRequest(a);

};


TourCMS.prototype.generateSignature = function(path, channelId, verb, outboundTime, apiKey) {

  var stringToSign = channelId + "/" + this.options.marketplaceId + "/" + verb + "/" + outboundTime + path;
  var hash = crypto.createHmac('SHA256', apiKey).update(stringToSign).digest('base64');
  var signature = this.rawurlencode(hash);

  return signature;
};

// Generate the current Unix Timestamp (PHP style)
TourCMS.prototype.generateTime = function() {
  return Math.floor(new Date().getTime() / 1000);
};

// Convert a JS date to the format TourCMS uses
// YYYY-MM-DD
TourCMS.prototype.toTourcmsDate = function(date) {
  return date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
};

// URL encode to match PHP
TourCMS.prototype.rawurlencode = function(str) {
  str = (str + '').toString();

  return encodeURIComponent(str)
  .replace(/!/g, '%21')
  .replace(/'/g, '%27')
  .replace(/\(/g, '%28')
  .replace(/\)/g, '%29')
  .replace(/\*/g, '%2A');
};

// export the class

module.exports = TourCMS;
