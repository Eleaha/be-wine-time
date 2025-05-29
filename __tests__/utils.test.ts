import { formatSQLInsertColumns, formatSQLUpdateColumns } from "../src/utils";

describe("formatSQLUpdateColumns", () => {
    test("returns a string", () => {
        expect(typeof formatSQLUpdateColumns({})).toBe("string");
    });
    test("when passed an object with one key/value pair, returns a string in the correct format", () => {
        const obj = { key: "value" };
        expect(formatSQLUpdateColumns(obj)).toBe("key = 'value'");
    });
    test("when passed an object with one key/value pair, returns a string in the correct format", () => {
        const obj = {
            key1: "value 1",
            key2: "value 2",
            key3: "value 3",
        };
        expect(formatSQLUpdateColumns(obj)).toBe(
            "key1 = 'value 1', key2 = 'value 2', key3 = 'value 3'"
        );
    });
});

describe("formatSQLInsertColumns", () => {
    const testObj = {
        brew_id: 1,
        date_added: "2023-04-02T21:03:28.822Z",
        type: "tasting-note",
        note_title: "tasting-note",
        body: "very sweet still, not very orangey",
    };
    test("returns a string", () => {
        expect(typeof formatSQLInsertColumns(testObj)).toBe("string");
    });
    test("formats an object correctly", () => {
        expect(formatSQLInsertColumns(testObj)).toBe(
            "brew_id, date_added, type, note_title, body"
        );
    });
});
