import { multiply } from "./scratch2";

test("2 * 3 should be 6",() =>{
    expect(multiply(2,3)).toBe(6)
})

test("3 * 4 should be 12", () =>{
    expect(multiply(3,4)).toBe(12)
})