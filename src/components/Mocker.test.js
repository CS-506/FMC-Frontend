const mock = require('./Mocker')

test('Mock test', () => {
    expect(mock(1, 2)).toBe(3)
})