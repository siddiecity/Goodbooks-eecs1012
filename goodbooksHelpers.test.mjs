// goodbooksHelpers.test.mjs
// created by Muhammadmehdi 

import { describe, it, expect } from "vitest";
import {
  isLoginValid,
  buildGoogleBooksUrl,
} from "./goodbooksHelpers.mjs";

// Test case 1: login logic
describe("isLoginValid", () => {
  it("returns true only for correct username and password", () => {
    // correct credentials
    expect(isLoginValid("reader", "1234")).toBe(true);

    // wrong username
    expect(isLoginValid("wrongUser", "1234")).toBe(false);

    // wrong password
    expect(isLoginValid("reader", "9999")).toBe(false);
  });
});

// Test case 2: Google Books URL logic
describe("buildGoogleBooksUrl", () => {
  it("encodes the search term and builds the correct Google Books URL", () => {
    const term = "Harry Potter & Magic";

    const url = buildGoogleBooksUrl(term);

    expect(url).toBe(
      "https://www.googleapis.com/books/v1/volumes?q=" +
        encodeURIComponent(term)
    );
  });
});
