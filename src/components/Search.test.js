
import React from 'react';
import Search from './Search';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Link, MemoryRouter } from 'react-router-dom';
import { InputBase, Button } from '@material-ui/core/';

//import * as ReactReduxHooks from "./react-redux-hooks";

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
        expect(wrapper).toMatchSnapshot();
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

    test('Searching with keyWord', () => {
        
        const context = (
            <MemoryRouter>
                <Search 
                    location={{
                        state: {
                            keyWord: " ",
                            keySubject: " ",
                            keyInstructor: " "
                        }
                    }}
                />
            </MemoryRouter>  
        );
        const wrapper = mount(context);

        wrapper.find(InputBase).at(0).simulate("change", {
            target: { value: "computer"}
        });
        wrapper.find(Button).at(0).simulate("click");
        wrapper.instance().forceUpdate(); 
        wrapper.update();
        // Jest cannot test useEffect, as well as functions within functional components
        expect(wrapper.find('TestResult').prop('value')).toHaveLength(0); 
    });

    

});
