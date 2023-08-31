import renderer from "react-test-renderer";
// import {render, fireEvent, screen} from '@testing-library/react';

import App from "./App";
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));
it("test UI", () => {
    const a = renderer.create(<App />);
    let tree = a.toJSON();
    expect(tree).toMatchSnapshot();
});
