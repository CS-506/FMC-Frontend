import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { TextField, Button } from '@material-ui/core/';
import Login from "./Login"; 

Enzyme.configure({ adapter: new Adapter() });

describe('Testing Login Page', () => {
    test('Render Login Page', () => {
        const wrapper = shallow(
            <Login 
                location={{
                state: {}
            }}/>);
        expect(wrapper.exists()).toBe(true);
    });

    test('Login with empty email', () => {
        const wrapper = mount(
            <Login 
                location={{
                state: {}
            }}/>);
        wrapper.find(Button).at(1).simulate("click");
        expect(wrapper.find('TestText').prop('valueAT')).toEqual("Please enter your email address.");
    });

    test('Login with non-wisc email', () => {
        const wrapper = mount(
            <Login 
                location={{
                state: {}
            }}/>);
        wrapper.find(TextField).at(0).simulate("change", {
            target: { value: "rliu227@gmail.edu"}
        });
        wrapper.find(Button).at(1).simulate("click");
        wrapper.update();
        //expect(wrapper.find('TestText').prop('valueAT')).toEqual("Please use a UW-Madison email address.");
    });

    test('Check Register button', () => {
        const wrapper = mount(
            <Login 
                location={{
                state: {}
            }}/>);
        expect(wrapper.find(Button).at(0).prop('href')).toEqual("/register");
    });
}); 