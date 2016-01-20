'use strict';

var assert = require('assert');
var TourCMS = require('../node-tourcms.js');

describe('TourCMS', function() {

  describe('Constructor', function() {

    describe('new TourCMS();', function() {

      var defaults = {};

      before(function(){
        defaults = {
          hostname: 'api.tourcms.com',
          apiKey: '',
          marketplaceId: 0,
          channelId: 0,
          channels: []
        };
      });

      it('create new instance', function(){
        var client = new TourCMS();
        assert(client instanceof TourCMS);
      });

      it('has default options', function(){
        var client = new TourCMS();
        assert.equal(
          Object.keys(defaults).length,
          Object.keys(client.options).length
        );
        assert.deepEqual(
          Object.keys(defaults),
          Object.keys(client.options)
        );
      });

      it('accepts and overrides options', function(){
        var options = {
          apiKey: 'AAAAAAA',
          marketplaceId: 123,
          channelId: 456,
        };

        var client = new TourCMS(options);

        assert(client.options.hasOwnProperty('apiKey'));
        assert.equal(client.options.apiKey, options.apiKey);

        assert(client.options.hasOwnProperty('marketplaceId'));
        assert.equal(client.options.marketplaceId, options.marketplaceId);

        assert(client.options.hasOwnProperty('channelId'));
        assert.equal(client.options.channelId, options.channelId);

      });

    });
  });

  describe('Prototypes', function() {
    describe('prototype.generateSignature();', function() {
      var client;

      before(function(){
        client = new TourCMS({apiKey:"AAA"});
      });

      it('method exists', function(){
        assert.equal(typeof client.generateSignature, 'function');
      });

      it('generate signature', function(){
        // generateSignature(a.path, a.channelId, a.verb, outboundTime, this.options.apiKey);
        var path = "/api/rate_limit_status.xml",
        channelId = 3930,
        verb = "GET",
        outboundTime = 1453310629,
        apiKey = "AAAAAA";

        assert.throws(
          client.generateSignature,
          Error
        );

        assert.equal(
          client.generateSignature(path, channelId, verb, outboundTime, apiKey),
          "Pjob2G09DPqeayLkxKVcjCgK0Frc%2BRLY2YVcTYdcR1k%3D"
        );

      });
    });

  });

});
