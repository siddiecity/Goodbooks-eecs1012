import { describe, it, expect } from 'vitest';
import { USER, PASS } from "script.js";

// really simple version of Vitest Mocking- to create a fake version of what is expected/how to code should work
describe('test of correct username and password when logging in', () => {
    it('when username is correct, it should return true', () => {
        // source: https://betterstack.com/community/guides/testing/vitest-explained/
        const username = 'reader';

        expect(USER).toBe(username);
    }) 
    
    it('when password is correct, it should return true', () => {
        const password = '1234';

        expect(PASS).toBe(password);
    })
})

describe('test of star review', () => {
    it('shows what stars are shown based on number 1 chosen', () => {
        expect("★".repeat(1)).toBe("★");
    })

    it('shows what stars are shown based on number 2 chosen', () => {
        expect("★".repeat(2)).toBe("★★");
    })

    it('shows what stars are shown based on number 3 chosen', () => {
        expect("★".repeat(3)).toBe("★★★");
    })

    it('shows what stars are shown based on number 4 chosen', () => {
        expect("★".repeat(4)).toBe("★★★★");
    })

    it('shows what stars are shown based on number 5 chosen', () => {
        expect("★".repeat(5)).toBe("★★★★★");
    })

})

describe('test of searching books using API', () => {
    it('when user searches Divergent, it should give them the correct URL', () => {
        const text = "The Maze Runner"
        const url = "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(text)

        expect(url).toBe('https://www.googleapis.com/books/v1/volumes?q=The%20Maze%20Runner')
    })
    
    it('when user searches Divergent, it should give them the correct URL', () => {
        const text = "Shadow and Bone"
        const url = "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(text)

        expect(url).toBe('https://www.googleapis.com/books/v1/volumes?q=Shadow%20and%20Bone')
    }) 
    
})

