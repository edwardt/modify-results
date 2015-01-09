var assert    = require('chai').assert;
var _         = require('lodash');
var KimFilter = require('../default');

describe('Kimono JS Transforms', function() {
  describe('Basic', function() {
    var testData;
    beforeEach(function() { 
      testData = { name: 'testData', results: { 'c1': [ { key: 1, val: "data1"}, { key: 2, val: "data2"}, { key: 3, val: "data3" }]}};
    });

    it('should have 3 entires', function() {
      assert.equal(testData.results['c1'].length, 3);
    });

    it('`output()` should not modify data', function(done) {
      (new KimFilter(testData))
      .output(function(copy){ 
        assert.equal(_.isEqual(testData, copy), true);
        done();
      });
    });

    it('`setCurrCollection()` should not modify data', function(done) {
      new KimFilter(testData)
      .setCurrCollection('NewCollection')
      .output(function(copy) {
        assert.equal(_.isEqual(testData, copy), true);
        done();
      });
    });
  });

  describe('Default Transforms', function() {
    var testData;
    beforeEach(function() { 
      testData = { name: 'testData', results: { 'c1': [ { key: 1, val: "data1"}, { key: 2, val: "data2"}, { key: 3, val: "data3" }]}};
    });

    //==================================================================
    //                            Sort
    //==================================================================
    describe('Sort', function() {
      it('should sorty data in descending order', function(done) {
        (new KimFilter(testData))
        .setCurrCollection('c1')
        .sort({
          property: 'key',
          lowToHigh: 0
        })
        .output(function(result) {
          var sorted = { name: 'testData', results: { 'c1': [ { key: 3, val: "data3"}, { key: 2, val: "data2"}, { key: 1, val: "data1" }]}};

          assert.equal(_.isEqual(result, sorted), true);
          done();
        });
      });

      it('should sorty data in ascending order', function(done) {
        (new KimFilter(testData))
        .setCurrCollection('c1')
        .sort({
          property: 'key',
        })
        .output(function(result) {
          var sorted = { name: 'testData', results: { 'c1': [ { key: 1, val: "data1"}, { key: 2, val: "data2"}, { key: 3, val: "data3" }]}};

          assert.equal(_.isEqual(result, sorted), true);
          done();
        });
      });
    });


    //==================================================================
    //                            Replace 
    //==================================================================
    describe('Replace', function() {
      it('should not modify input data(empty pattern)', function(done) {
        (new KimFilter(testData))
        .setCurrCollection('c1')
        .replace({
          property: 'val',
          from: '',
          to: ''
        })
        .output(function(result) {
          var replaced = { name: 'testData', results: { 'c1': [ { key: 1, val: "data1"}, { key: 2, val: "data2"}, { key: 3, val: "data3" }]}};
          assert.equal(_.isEqual(replaced, result), true);
          done();
        });
      });


      it('should not modify input data(non-matched pattern)', function(done) {
        (new KimFilter(testData))
        .setCurrCollection('c1')
        .replace({
          property: 'val',
          from: '123',
          to: '()'
        })
        .output(function(result) {
          var replaced = { name: 'testData', results: { 'c1': [ { key: 1, val: "data1"}, { key: 2, val: "data2"}, { key: 3, val: "data3" }]}};
          assert.equal(_.isEqual(replaced, result), true);
          done();
        });
      });


      it('should replace `data` with `value`', function(done) {
        (new KimFilter(testData))
        .setCurrCollection('c1')
        .replace({
          property: 'val',
          from: 'data',
          to: 'value'
        })
        .output(function(result) {
          var replaced = { name: 'testData', results: { 'c1': [ { key: 1, val: "value1"}, { key: 2, val: "value2"}, { key: 3, val: "value3" }]}};
          assert.equal(_.isEqual(replaced, result), true);
          done();
        });
      });

      it('should replace the trailing number of `val` with a `.`', function(done) {
        (new KimFilter(testData))
        .setCurrCollection('c1')
        .replace({
          property: 'val',
          from: /[123]$/,
          to: '.'
        })
        .output(function(result) {
          var replaced = { name: 'testData', results: { 'c1': [ { key: 1, val: "data."}, { key: 2, val: "data."}, { key: 3, val: "data." }]}};
          assert.equal(_.isEqual(replaced, result), true);
          done();
        });
      });
    });


    //==================================================================
    //                            Split 
    //==================================================================
    describe('Split', function() {
      var testData;
      beforeEach(function() { 
        testData = { name: 'testData', results: { 'c1': [ { key: 1, val: "data 1"}, { key: 2, val: "data 2"}, { key: 3, val: "data 3" }]}};
      });

      it('should split `val` into `first` and `second`', function() {
        (new KimFilter(testData))
        .setCurrCollection('c1')
        .split({
          property: 'val',
          separator: ' ',
          names: ['first', 'second']
        })
        .output(function(result) {
          var splited = { name: 'testData', results: { 'c1': [ { key: 1, first: 'data', second: '1'}, { key: 2, first: 'data', second: '2'}, { key: 3, first: 'data', second: '3'}]}};
          assert.equal(_.isEqual(splited, result), true);
          done();
        });
      });

      it('should split `val` into `val_1` and `val_2`(`names` not provided)', function() {
        (new KimFilter(testData))
        .setCurrCollection('c1')
        .split({
          property: 'val',
          separator: ' ',
        })
        .output(function(result) {
          var splited = { name: 'testData', results: { 'c1': [ { key: 1, val_1: 'data', val_2: '1'}, { key: 2, val_1: 'data', val_2: '2'}, { key: 3, val_1: 'data', val_2: '3'}]}};
          assert.equal(_.isEqual(splited, result), true);
          done();
        });
      });

      it('should only keep the first k properties if the length of `names` is k', function() {
        (new KimFilter(testData))
        .setCurrCollection('c1')
        .split({
          property: 'val',
          separator: ' ',
          names: ['first']
        })
        .output(function(result) {
          var splited = { name: 'testData', results: { 'c1': [ { key: 1, first: 'data' }, { key: 2, first: 'data' }, { key: 3, first: 'data' }]}};
          assert.deepEqual(result, splited);
          done();
        });
      });

      it('should not split the value of property (separator not found)', function() {
        (new KimFilter(testData))
        .setCurrCollection('c1')
        .split({
          property: 'val',
          separator: '*',
        })
        .output(function(result) {
          var splited = { name: 'testData', results: { 'c1': [ { key: 1, val: "data 1"}, { key: 2, val: "data 2"}, { key: 3, val: "data 3" }]}};
          assert.deepEqual(result, splited);
          done();
        });
      });

      it('should not split the value of property but rename the property (only 1 element generated after split)', function() {
        (new KimFilter(testData))
        .setCurrCollection('c1')
        .split({
          property: 'val',
          separator: '*',
          names: ['newval']
        })
        .output(function(result) {
          var splited = { name: 'testData', results: { 'c1': [ { key: 1, newval: "data 1"}, { key: 2, newval: "data 2"}, { key: 3, newval: "data 3" }]}};
          assert.equal(_.isEqual(splited, result), true);
          done();
        });
      });
    });

    //==================================================================
    //                           Merge 
    //==================================================================
    describe('Merge', function() {
      var testData;
      beforeEach(function() { 
        testData = { name: 'testData', results: { 'c1': [ { key: 1, val: "data 1"}, { key: 2, val: "data 2"}, { key: 3, val: "data 3" }]}};
      });

      it('should merge `key` and `val` into `pair` while keep the attribute names', function(done) {
        (new KimFilter(testData))
        .setCurrCollection('c1')
        .merge({
          properties: ['key', 'val'],
          newProp: 'key_val',
        })
        .output(function(result) {
          var merged = { name: 'testData', results: { 'c1': [ { key_val: { key: 1, val: "data 1"} }, { key_val: { key: 2, val: "data 2"} }, { key_val: { key: 3, val: "data 3"} } ]}};
          assert.deepEqual(merged, result);
          done();
        });
      });

      it('should merge `key` and `val` into `pair` while renaming `key` to `subkey` and `val` to `subval`', function(done) {
        (new KimFilter(testData))
        .setCurrCollection('c1')
        .merge({
          properties: ['key', 'val'],
          newProp: 'key_val',
          newProperties: ['subkey', 'subval']
        })
        .output(function(result) {
          var merged = { name: 'testData', results: { 'c1': [ { key_val: { subkey: 1, subval: "data 1"} }, { key_val: { subkey: 2, subval: "data 2"} }, { key_val: { subkey: 3, subval: "data 3"} } ]}};
          assert.deepEqual(merged, result);
          done();
        });
      });
    });

    //==================================================================
    //                           toInt
    //==================================================================
    describe('toInt', function() {
      var testData;
      beforeEach(function() { 
        testData = { name: 'testData', results: { 'c1': [ { key: 1, val: "data 1"}, { key: 2, val: "data 2"}, { key: 3, val: "data 3" }]}};
      });

      it('should convert char to integer', function(done) {
        (new KimFilter(testData)
        .setCurrCollection('c1')
        .split({
          property: 'val',
          separator: ' ',
          names: ['first', 'second']
        }))
        .toInt({
          property: 'second'
        })
        .output(function(result) {
          var withInt = { name: 'testData', results: { 'c1': [ { key: 1, first: 'data', second: 1}, { key: 2, first: 'data', second: 2}, { key: 3, first: 'data', second: 3 }]}};
          assert.deepEqual(withInt, result);
          done();
        });
      });
    });

    //==================================================================
    //                           toFloat
    //==================================================================
    describe('toFloat', function() {
      var testData;
      beforeEach(function() { 
        testData = { name: 'testData', results: { 'c1': [ { key: 1, val: "data 1.2814123"}, { key: 2, val: "data 2.2321312"}, { key: 3, val: "data 3.324" }]}};
      });

      it('should convert char to float', function(done) {
        (new KimFilter(testData))
        .setCurrCollection('c1')
        .split({
          property: 'val',
          separator: ' ',
          names: ['first', 'second']
        })
        .toFloat({
          property: 'second',
          decimal: 3
        })
        .output(function(result) {
          var withFloat = { name: 'testData', results: { 'c1': [ { key: 1, first: 'data', second: 1.281}, { key: 2, first: 'data', second: 2.232}, { key: 3, first: 'data', second: 3.324}]}};
          assert.deepEqual(withFloat, result);
          done();
        });
      });
    })

    //==================================================================
    //                           Remove
    //==================================================================
    describe('Remove', function() {
      var testData;
      beforeEach(function() { 
        testData = { name: 'testData', results: { 'c1': [ { key: 1, first: 'data', second: 1.281}, { key: 2, first: 'data', second: 2.232}, { key: 3, first: 'data', second: 3.324}]}};
      });

      it('should not remove any element' ,function() {
        (new KimFilter(testData))
        .setCurrCollection('c1')
        .remove({
          property: 'second',
          operator: '===',
          target: 5
        })
        .output(function(result) {
          var filtered = { name: 'testData', results: { 'c1': [ { key: 1, first: 'data', second: 1.281}, { key: 2, first: 'data', second: 2.232}, { key: 3, first: 'data', second: 3.324}]}};
          assert.deepEqual(filtered, result);
          done();
        });
      })

      it('should remove element whose `val` is larger than 2', function(done) {
        (new KimFilter(testData))
        .setCurrCollection('c1')
        .remove({
          property: 'second',
          operator: '>',
          target: 2
        })
        .output(function(result) {
          var filtered = { name: 'testData', results: { 'c1': [ { key: 1, first: 'data', second: 1.281} ]}};
          assert.deepEqual(filtered, result);
          done();
        });
      });

      it('should remove all elements' ,function() {
        (new KimFilter(testData))
        .setCurrCollection('c1')
        .remove({
          property: 'second',
          operator: '>',
          target: 0
        })
        .output(function(result) {
          //_.forEach(result.results.c1, function(val, key, idx) {
          //  console.log(val);
          //});
          var filtered = { name: 'testData', results: { 'c1': []}};
          assert.deepEqual(filtered, result);
          done();
        });
      })
    });

    //==================================================================
    //                           RemoveProp
    //==================================================================
    describe('RemoveProp', function() {
      it('should');
    });
  });
});
