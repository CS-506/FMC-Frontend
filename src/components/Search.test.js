
import React from 'react';
import Search from './Search';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Link } from 'react-router-dom';

Enzyme.configure({ adapter: new Adapter() });

describe('Desperate trying', () => {
    it('Render Search Page', () => {       
        const wrapper = shallow(
            <Search
                location={{
                    state: {
                        keyWord: " ",
                        keySubject: " ",
                        keyInstructor: " "
                    }
                }}
            />
        );
        expect(wrapper.exists()).toBe(true);
    });

    it('Props passed are stored', () => {
        const wrapper = shallow(
            <Search
                location={{
                    state: {
                        keyWord: "system",
                        keySubject: "COMP SCI",
                        keyInstructor: "Remzi"
                    }
                }}
            />
        );
        expect(wrapper.find('TestKeyWord').prop('value')).toEqual("system"); 
        expect(wrapper.find('TestKeySubject').prop('value')).toEqual("COMP SCI"); 
        expect(wrapper.find('TestKeyInstructor').prop('value')).toEqual("Remzi"); 
    });

    it('Searching with keyWord', () => {
        const wrapper = shallow(
            <Search
                location={{
                    state: {
                        keyWord: "A keyWord that will not give any search result",
                        keySubject: " ",
                        keyInstructor: " "
                    }
                }}
            />
        ); 
        // Jest cannot test useEffect, as well as functions within functional components
        expect(wrapper.find('TestResult').prop('value')).toHaveLength(0); 
    });

});
