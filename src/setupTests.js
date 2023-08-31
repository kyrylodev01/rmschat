// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import renderer from "react-test-renderer";
// import {render, fireEvent, screen} from '@testing-library/react';

import App from "./App";
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));
it("asdfasdf", () => {
    const a = renderer.create(<App />);
    let tree = a.toJSON();
    expect(tree).toMatchSnapshot();
});
// global.ResizeObserver = require('resize-observer-polyfill')
// global.ResizeObserver = jest.fn().mockImplementation(() => ({
//     observe: jest.fn(),
//     unobserve: jest.fn(),
//     disconnect: jest.fn(),
// }))
// test('randomize data', () => {
//     render(<App />);
//     const randomizeBtn = screen.getByTestId('randomize');
//     fireEvent.click(randomizeBtn);

// });
