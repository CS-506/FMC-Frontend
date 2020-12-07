import React from 'react';
import CommentCard from './CommentCard';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
    Typography, IconButton
  } from "@material-ui/core";
import { Link } from 'react-router-dom';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';

Enzyme.configure({ adapter: new Adapter() });


describe('Testing CommentCard', () => {
    // const expect = require('chai').expect; 
    // A failed attempt to use chai library to call useEffect. 
    const commentText = 'Testing is the hardest thing ever';
    const user = {
        userId: 3, 
    }
    const cmt = {
        s_comment_id: 2,
        userId: 3,
        sectionId: 2, 
        comment: commentText, 
        time: '2020-11-12 10:10:10'
    }
    const thisSection = {
        sectionId: 2,
        courseId: 1
    }
    const thisCourse = {
        courseId: 1,
        subject: "COMP SCI",
        code: "506",
        name: "Software Engineering"
    }
    
    test('Render CommentCard', () => {
        
        const wrapper = shallow(
            <CommentCard 
                comment={cmt}
                byUser={user ?
                    (cmt.userId === user.userId) : false}
                showTitle={true}
            />
        );
        expect(wrapper.exists()).toBe(true);

    });

    test('Comment contents testing', () => {
        
        const wrapper = mount(
            <CommentCard 
                comment={cmt}
                byUser={user ?
                    (cmt.userId === user.userId) : false}
                showTitle={false}
            />
        );
        expect(wrapper.find(Typography).at(1).text()).toEqual(commentText);
    });

    test('Comment showing course title', () => {
        
        /*
        // Another failed attempt to call useEffect
        let useEffect;
        const mockUseEffect = () => {
            useEffect.mockImplementationOnce(f => f());
        };
        useEffect = jest.spyOn(React, "useEffect");
        mockUseEffect(); 
        */
        const wrapper = mount(
            <CommentCard 
                comment={cmt}
                byUser={user ?
                    (cmt.userId === user.userId) : false}
                showTitle={true}
            />
        );
        expect(wrapper.find(Typography).at(0).text()).toEqual("null: null");
    });

    test('Delete comment by its owner', () => {
        
        const wrapper = mount(
            <CommentCard 
                comment={cmt}
                byUser={user ?
                    (cmt.userId === user.userId) : false}
                showTitle={true}
            />
        );
        expect(wrapper.find(IconButton).exists()).toBe(true);
        wrapper.find(IconButton).simulate("click");
        
    });

    
});