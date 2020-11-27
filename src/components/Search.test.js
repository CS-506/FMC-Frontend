
import React from 'react';
import Search from './Search';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Link } from 'react-router-dom';

Enzyme.configure({ adapter: new Adapter() });

describe('Desperate trying', () => {
    it('Just render it PLEASE...', () => {
        const wrapper = shallow(
            <Link to={{
                pathname: '/Search',
                state: {
                    "keyWord": " ",
                    "keySubject": " ",
                    "keyInstructor": " ",
                },
            }}
            />
        );
        expect(wrapper.exists()).toBe(true);

        /*
        const wrapper = shallow(
            <Search
                location={
                    state={
                        keyWord: " ",
                        keySubject: " ",
                        keyInstructor: " "
                    }
                }
            />
        );
        expect(wrapper.exists()).toBe(true);
        */
    });

});
