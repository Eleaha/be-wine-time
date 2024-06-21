import { format } from "path"
import { formatPatchString } from "../src/utils"

describe("formatPatchObject", () => {
    test("returns a string", () => {
        expect(typeof formatPatchString({})).toBe("string")
    })
    test("when passed an object with one key/value pair, returns a string in the correct format", () => {
        const obj = {key: "value"}
        expect(formatPatchString(obj)).toBe("key = 'value'")
    })
    test("when passed an object with one key/value pair, returns a string in the correct format", () => {
        const obj = {
            key1: "value 1",
            key2: "value 2",
            key3: "value 3"
         };
        expect(formatPatchString(obj)).toBe("key1 = 'value 1', key2 = 'value 2', key3 = 'value 3'")
    });
    test("only adds quotation marks around a strings - leave booleans, numbers un-quoted", () => {
        const obj = {
					key1: true,
					key2: 1,
                    key3: "value 3"
				};
                expect(formatPatchString(obj)).toBe("key1 = true, key2 = 1, key3 = 'value 3'")
    })
})