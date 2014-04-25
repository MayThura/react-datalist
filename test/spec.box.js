var dom            = require('../dom')('<html><body><div id="container"></div></body></html>')
var assert         = require('assert')
var React          = require('react')
var nanodom        = require('nanodom')
var datalist       = require('../react-datalist-box')
var ReactAddons    = require('react/addons')

var ReactTestUtils = React.addons.TestUtils

var options        = ['apple','orange','pear','pineapple','melon']
var defaultOptions = {options:options, list:'fruit', force:true, filter:''}
var _datalist;
function render(options, callback) {
    _datalist = React.renderComponent(datalist(options), nanodom('#container')[0], callback)
}
function merge(obj1, obj2) {
    var obj3 = {}
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname] }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname] }
    return obj3
}

describe('DATALIST BOX', function() {

    before(function(done) {
        render(defaultOptions, function() {
            done()
        })
    })

    it('Should render a container, an input and a datalist', function(done) {
        var __datalist = nanodom('.react-datalist')
        assert(__datalist.length == 1)
        var __container = nanodom('.react-datalist-container')
        assert(__container.length == 1)
        var __input = nanodom('.react-datalist-input')
        assert(__input.length == 1)
        done()
    })

    it('Should be able to filter options', function() {
        var filtered = _datalist.filterOptions(options, null)
        assert(filtered.length === options.length)
        filtered = _datalist.filterOptions(options)
        assert(filtered.length === options.length)
        filtered = _datalist.filterOptions(options, "p")
        assert(filtered.length === 3)
        filtered = _datalist.filterOptions(options, "lon")
        assert(filtered.length === 1)
    })

    it('Should render a datalist with the passed options', function(done) {
        var domlist = nanodom('.react-datalist')
        assert(domlist.length == 1)
        assert(domlist[0].childNodes.length == options.length)
        assert(domlist[0].id == 'fruit')
        assert(domlist[0].style._values.display === 'block')
        done()
    })

    it('Should filter options based on filter prop', function(done) {
        var opts = merge(defaultOptions, {filter:'p'})
        render(opts, function() {
            var domlist = nanodom('.react-datalist')[0]
            assert(domlist.childNodes.length == 3)
            assert(domlist.style._values.display === 'block')
            done()
        })
    })

    it('Filter matching option should hide the options', function(done) {
        var opts = merge(defaultOptions, {filter:'melon'})
        render(opts, function() {
            var domlist = nanodom('.react-datalist')[0]
            assert(domlist.childNodes.length == 1)
            assert(domlist.style._values.display === 'none')
            done()
        })
    })

    it('Passing hideOptions should hide options no matter what', function(done) {
        var opts = merge(defaultOptions, { hideOptions : true })
        render(opts, function() {
            var domlist = nanodom('.react-datalist')[0]
            assert(domlist.childNodes.length == options.length)
            assert(domlist.style._values.display === 'none')
            done()
        })
    })

    it('Should filter options should change when the input value changes', function(done) {
        var opts = merge(defaultOptions, {filter:'p'})
        render(opts, function() {
            var __datalist = nanodom('.react-datalist')[0]
            var __input    = nanodom('.react-datalist-input')[0]
            var _input     = ReactTestUtils.findRenderedDOMComponentWithTag(_datalist, 'input')
            assert(__datalist.childNodes.length == 3)
            __input.value = "melon"
            ReactTestUtils.Simulate.change(_input)
            assert(__datalist.childNodes.length == 1)
            done()
        })
    })

    it('Should call its callback', function(done) {
        var onChange = function(event) {
            assert(true)
            done()
        }
        var opts = merge(defaultOptions, {onChange:onChange})
        render(opts, function() {
            var _input = ReactTestUtils.findRenderedDOMComponentWithTag(_datalist, 'input')
            ReactTestUtils.Simulate.change(_input)
        })
    })

    it('Can navigate options with arrow keys', function(done) {
        var opts = merge(defaultOptions, {filter:''})
        render(opts, function() {
            var __datalist = nanodom('.react-datalist')[0]
            var __input    = nanodom('.react-datalist-input')[0]
            var _input     = ReactTestUtils.findRenderedDOMComponentWithTag(_datalist, 'input')
            assert(__datalist.childNodes.length == options.length)
            // Down to first item
            ReactTestUtils.Simulate.keyDown(_input, {which: 40, type: "keydown"})
            var __option = nanodom('.react-datalist-option-selected')
            assert(__option.length == 1)
            assert(__option[0].innerHTML == options[0])
            // Down to second item
            ReactTestUtils.Simulate.keyDown(_input, {which: 40, type: "keydown"})
            var __option = nanodom('.react-datalist-option-selected')
            assert(__option.length == 1)
            assert(__option[0].innerHTML == options[1])
            // Up to first item
            ReactTestUtils.Simulate.keyDown(_input, {which: 38, type: "keydown"})
            var __option = nanodom('.react-datalist-option-selected')
            assert(__option.length == 1)
            assert(__option[0].innerHTML == options[0])
            done()
        })
    })

    it('Can select an option by hitting enter', function(done) {
        var selected = function(option) {
            assert(option == options[0])
            done()
        }
        var opts = merge(defaultOptions, {filter:'', selected:false, onOptionSelected:selected})
        render(opts, function() {
            var __datalist = nanodom('.react-datalist')[0]
            var __input    = nanodom('.react-datalist-input')[0]
            var _input     = ReactTestUtils.findRenderedDOMComponentWithTag(_datalist, 'input')
            assert(__datalist.childNodes.length == options.length)
            // Down to an item
            ReactTestUtils.Simulate.keyDown(_input, {which: 40, type: "keydown"})
            var __option = nanodom('.react-datalist-option-selected')
            assert(__option.length == 1)
            // Enter to select it
            ReactTestUtils.Simulate.keyDown(_input, {which: 13, type: "keydown"})
        })
    })

/*
    test arrow up/down
    test click option
    test click input
    test esc
*/

})