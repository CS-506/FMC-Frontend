// Testing with Jest
// Which is only able to test function written like Mocker.js,
// But not able to test everything useful that we have written. 

/* Usage: in package.json, find: 
    "scripts": {
        "test": "react-scripts test",
    },
    and change "react-scripts test" to "jest".
    To see the in-our-case-meaningless code coverage, 
    use "jest --coverage" instead. 
*/

// You could say I can't use it because I know too little,
// after two whole days of researching,
// and I say I tried.
// Let's just use "react-scripts test" 
// without displaying coverage for now.

const mock = require('./Mocker')

test('Mock test', () => {
    expect(mock(1, 2)).toBe(3)
})