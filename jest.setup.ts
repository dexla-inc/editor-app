import "@testing-library/jest-dom";

global.fetch = require("isomorphic-fetch");

jest.mock("nanoid");

jest.mock("next/router", () => ({
  useRouter() {
    return {
      // Mock properties here based on your test needs
      path: "/",
      asPath: "/",
      query: {},
      push: jest.fn(),
      // Add any other router properties or methods your component uses
    };
  },
}));
