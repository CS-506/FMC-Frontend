
import React from 'react';
import Search from './Search';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Desperate trying', () => {
    it('Just render it mf', () => {
        //const tree = renderer.create(<Search />).toJSON();
        
        var state={
            keyWord: " ",
            keySubject: " ",
            keyInstructor: " "
        }
        const wrapper = shallow(
            <Search 
                location={    
                    state
                } 
            />
            );
        expect(wrapper.exists()).toBe(true);
    });

});
/*
const mock = require('./Search')

test('Search test', () => {
    expect(mock.exist()).toBe(true)
})
*/
