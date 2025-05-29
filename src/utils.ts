import format from "pg-format";

export const formatSQLUpdateColumns = (objectToFormat: {
    [index: string]: any;
}) => {
    let queryArr: any[] = [];
    for (const key in objectToFormat) {
        queryArr.push(format(`%I = %L`, key, objectToFormat[key]));
    }
    return queryArr.join(", ");
};

export const formatSQLInsertColumns = (objectToFormat: {
    [index: string]: any;
}) => {
    return Object.keys(objectToFormat)
        .map((key) => format("%I", key))
        .join(", ");
};
