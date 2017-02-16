//var TourCMSApi = require('tourcms'); //to use online one
var TourCMSApi = require('./node-tourcms'); //to use local one
var concat = require('concat-stream');
var xml2js = require('xml2js');

var TourCMS = new TourCMSApi({
  channelId: 3930,
  apiKey: '0df0db4dc340',
  marketplaceId: 0
});

/*TourCMS.showBooking({
  bookingId: 12920,
  callback: function(response) {
    //console.log(response.booking.booking_name);
    console.info(response);
  }
});*/

/**********************************
****  Remove booking component ****
*
***********************************/
/*TourCMS.removeBookingComponent({
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
*/

/**********************************
****   Add booking component   ****
*
***********************************/
/*TourCMS.addBookingComponent({
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
  });*/

/**********************************
****  Update booking component  ***
*
***********************************/

/*TourCMS.updateBookingComponent({
    channelId: 3930,
    booking: {
      booking_id: 12920,
      component: {
          component_id: 8286216,
          sale_quantity: 3
      }
    },
    callback: function(response) {
      console.log(response.error);
    }
  });*/

/**********************************
****  Send booking email       ****
*
***********************************/

/*TourCMS.sendBookingEmail({
    channelId: 3930,
    booking: {
      booking_id: 12920,
      email_type: 1
    },
    callback: function(response) {
      console.info(response);
    }
  });*/

/***********************************
****  Check option availability ****
*
************************************/

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
