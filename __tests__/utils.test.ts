import { formatPatchString } from "../src/utils"

//returns string
//returns in correct format with key value pair
//returns in correct format when passes an object with multiple key value pairs
//accounts for type eg quoted for string, not for numbers - preserves types

//do I want it to throw an error if an empty object is passed?
describe("formatPatchObject", () => {
    test("returns a string", () => {
        expect(typeof formatPatchString({})).toBe("string")
    })
    test("when passed an object with one key/value pair, returns a string in the correct format", () => {
        const obj = {key: "value"}
        expect(formatPatchString(obj)).toBe('key = "value"')
    })
    test("when passed an object with one key/value pair, returns a string in the correct format", () => {
        const obj = {
            key1: "value 1",
            key2: "value 2",
            key3: "value 3"
         };
        expect(formatPatchString(obj)).toBe('key1 = "value 1", key2 = "value 2", key3 = "value 3"')
    });
})