import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Link, MemoryRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Home from './Home';
import LogoDisplay from './Home';
import Search from './Home';
import { IconButton, MenuItem } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';

Enzyme.configure({ adapter: new Adapter() });

describe('Testing Home Page', () => {
    test('Render HomePage', () => {
        const wrapper = shallow(<Home />);
        expect(wrapper.exists()).toBe(true);
    });

    test('', () => {
        const wrapper = shallow(<Home />);
        expect(wrapper.find(TextField).prop('placeholder')).toEqual("Type in Course Description ...");
    });

    test('Return keyWord typed in search box upon clicking search button', () => {      
        const wrapper = shallow(<Home />);
        wrapper.find(TextField).at(0).simulate("change", {
            target: { value: "KeyWord for testing"}
        });
        wrapper.find(Button).at(0).simulate("click");
        expect(wrapper.find('TestKeyWord').prop('value')).toBe("KeyWord for testing");
    });

    test('Check logo image used', () => {     
        const context = (
            <MemoryRouter>
                <Home />
            </MemoryRouter>  
        );
        const wrapper = mount(context);
        expect(wrapper.find(LogoDisplay).find('img').prop('src')).toEqual("Logo2.PNG");
    });

    test('Pass keyword to Search Page', () => {     
        const context = (
            <MemoryRouter>
                <Home />
            </MemoryRouter>  
        );
        const wrapper = mount(context);
        wrapper.find(TextField).at(0).simulate("change", {
            target: { value: "KeyWord for testing"}
        });
        wrapper.find(Button).at(1).simulate("click");
        wrapper.update();
        expect(wrapper.find(Link).prop('to')).toEqual({
            "pathname": "/Search", 
            "state": {
                "keyInstructor": " ", 
                "keySubject": " ", 
                "keyWord": " "
        }});
    
    });

    test('Upper right button should directs to login page when not logged in', () => {
        const wrapper = shallow(<Home loginStat={"not logged in"}/>);
        expect(wrapper.find(Button).at(0).prop('href')).toEqual("/login");
    });

    test('Upper right button should has profile and log out options when logged in', () => {
        const wrapper = shallow(<Home loginStat={"LOGGED_IN"}/>);
        expect(wrapper.find(AccountCircle).exists()).toBe(true);
        expect(wrapper.find(MenuItem).at(0).find(Link).prop('to')).toEqual("/Profile");
        expect(wrapper.find(MenuItem).at(1).exists()).toBe(true);
    });

    
}); 