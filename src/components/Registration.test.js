import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { TextField, Button } from '@material-ui/core/';
import Reg from "./Registration"; 
import LoginForm from "./Registration";
import {
    showAlert, alertSeverity, setShowAlert, alertText, email,
    emailHandler, password, passwordHandler, password2, password2Handler,
    code, codeHandler, verified, verifyHandler, registerHandler, 
    awaitVerification, cancelHandler
} from "./Registration";

Enzyme.configure({ adapter: new Adapter() });

describe('Testing Registration Page', () => {
    test('Render Registration Page', () => {
        const wrapper = shallow(<Reg />);
        expect(wrapper.exists()).toBe(true);
    });

    test('Register with empty email', () => {
        const wrapper = mount(<Reg />);
        wrapper.find(Button).at(0).simulate("click");
        expect(wrapper.find('TestAlertText').prop('valueAT')).toEqual("Please enter your email address.");
    });

    test('Register with non-wisc email', () => {
        const wrapper = mount(<Reg />);
        wrapper.find(TextField).at(2).simulate("change", {
            target: { value: "testemail@gmail.com"}
        });
        wrapper.find(Button).at(0).simulate("click");
        wrapper.update();
        //expect(wrapper.find('TestAlertText').prop('valueAT')).toEqual("Please use a UW-Madison email address.");
    });
}); 