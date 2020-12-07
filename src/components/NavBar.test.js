
import React from 'react';
import NavBar from './NavBar';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Link } from 'react-router-dom';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

Enzyme.configure({ adapter: new Adapter() });

describe('Testing NavBar', () => {
    test('Render NavBar', () => {
        const wrapper = shallow(<NavBar />);
        expect(wrapper.exists()).toBe(true);
    });

    test('Test initialized keyWord value to be " "', () => {
        const wrapper = shallow(<NavBar />);
        expect(wrapper.find('TestKeyWord').prop('value')).toBe(" ");
    }); 

    test('Return keyWord typed in search box upon clicking search button', () => {      
        const wrapper = shallow(<NavBar />);
        wrapper.find(InputBase).at(0).simulate("change", {
            target: { value: "KeyWord for testing"}
        });
        wrapper.find(Button).at(0).simulate("click");
        expect(wrapper.find('TestKeyWord').prop('value')).toBe("KeyWord for testing");
    });

    test('Return KeySubject typed in search box upon clicking search button', () => {
        const wrapper = shallow(<NavBar />);
        wrapper.find(InputBase).at(1).simulate("change", {
            target: { value: "KeySubject for testing"}
        });
        wrapper.find(Button).at(2).simulate("click");
        expect(wrapper.find('TestKeySubject').prop('value')).toBe("KeySubject for testing");
    
    });

    test('Return keyInstructor typed in search box upon clicking search button', () => {
        const wrapper = shallow(<NavBar />);
        wrapper.find(InputBase).at(2).simulate("change", {
            target: { value: "KeyInstructor for testing" }
        });
        wrapper.find(Button).at(2).simulate("click");
        expect(wrapper.find('TestKeyInstructor').prop('value')).toBe("KeyInstructor for testing");
    });

    test('Upper right button should directs to login page when not logged in', () => {
        const wrapper = shallow(<NavBar loginStat={"not logged in"}/>);
        expect(wrapper.find(Button).at(1).prop('href')).toEqual("/login");
    });

    test('Upper right button should has profile and log out options when logged in', () => {
        const wrapper = shallow(<NavBar loginStat={"LOGGED_IN"}/>);
        expect(wrapper.find(MenuItem).at(0).find(Link).prop('to')).toEqual("/Profile");
        expect(wrapper.find(MenuItem).at(1).exists()).toBe(true);
    });

    
}); 