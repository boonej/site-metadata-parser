var assert = require('chai').assert;
var Scraper = require('../lib/scraper');
var expect = require('expect');
var fs = require('fs');

var params = {
  host: 'www.google.com'
};

var testHTML = fs.readFileSync('spec/parsetest.ht');
var testScraper = new Scraper(params);

describe('Scraper', function() {
  
  describe('()', function() {

    it ('should throw an exception if no arguments are provided', function(){
      expect(function() {
        new Scraper();
      }).toThrow('must provide an arguments object');
    });

    it ('should not fail if host is provided', function() {
      expect(function() {
        new Scraper(params);
      }).toNotThrow();
    });

    it ('should throw exception if no host is provided', function(){
      expect(function(){
        new Scraper({});
      }).toThrow('must provide a string for host OR url argument');
    });

    it ('should strip protocol from an unsecure http url', function(){
      var p = new Scraper({host: 'http://www.google.com'});
      expect(p.getHost()).toBe('www.google.com');
    });

    it ('should strip protocol from an unsecure https url', function(){
      var p = new Scraper({host: 'https://www.google.com'});
      expect(p.getHost()).toBe('www.google.com');
    });
    
    it ('should fail if a path is included in the host parameter', function() {
      expect(function() {
        new Scraper({host: 'https://www.youtube.com/watch?v=oWnAvDsZKay'});
      }).toThrow('host must not contain path');
    })

  });

  describe('isValidUrl()', function(url) {
    it ('should return true if a valid url (with protocol) is provided', 
    function(){
      expect(testScraper.isValidUrl('http://www.google.com')).toBe(true);
    });

    it ('should return true if a valid url (https) is provided',
    function() {
      expect(testScraper.isValidUrl('https://www.google.com')).toBe(true);
    });

    it ('should return true if a valid url (no protocol) is provided',
    function() {
      expect(testScraper.isValidUrl('www.google.com')).toBe(true);
    });

    it ('should return true if an ip address is provided',
    function() {
      expect(testScraper.isValidUrl('192.168.1.1/test.html')).toBe(true);
    });

    it ('should throw exception if bad data is provided',
      function() {
      expect(function(){
        testScraper.isValidUrl(381);
      }).toThrow('string value must be provided');
    });
  });

  describe('scrape()', function() {
    it ('should not throw an exception if callback is provided', function() {
      expect(function() {
        new Scraper(params).scrape({host: 'www.google.com'}, function(err, data) {
  
        });
      }).toNotThrow();
    });
    
   

    it ('should return a valid object upon completion', function(done) {
      this.timeout(15000);
      new Scraper({host: 'https://www.youtube.com', path: '/watch?v=oWnAvDsZKaY'})
        .scrape(function(err, data) {
          if (typeof data !== 'object') {
            throw('Invalid object type returned.');
          }
          done();
        });

    });
    
    it ('should return a valid object if only a url is provided', function(done){
      this.timeout(15000);
      new Scraper({url: 'https://www.youtube.com/watch?v=oWnAvDsZKaY'})
        .scrape(function(err, data) {
          if (typeof data !== 'object') {
            throw('Invalid object type returned.');
          }
          done();
        });
    });

    it ('should contain expected data upon completion', function(done) {
      this.timeout(15000);
      new Scraper({host: 'https://www.youtube.com', path: '/watch?v=oWnAvDsZKaY'})
        .scrape(function(err, data) {
          if (data.alAndroidPackage !== 
            'com.google.android.youtube') {
            throw('Unexpected return data.');
          }
          done();
        });

    });
    
    it ('should contain expected data upon completion if only a url is provided', function(done) {
      this.timeout(15000);
      new Scraper({url: 'https://www.youtube.com/watch?v=oWnAvDsZKaY'})
        .scrape(function(err, data) {
          if (data.alAndroidPackage !== 
            'com.google.android.youtube') {
            throw('Unexpected return data.');
          }
          done();
        });

    });

  });

  describe('MetaParser', function(){

    describe('parse()', function(){
      it ('should create a valid object', function(done){
        var obj = new Scraper(params).metaParser.parse(testHTML.toString());
        expect(obj.twitterAppIdIpad).toBe('544007664');
        done();
      });
    });

  });

});


