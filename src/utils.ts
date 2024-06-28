//takes an object to format and returns a query string representing the columns to add to
export const formatSQLColumnString = (objectToFormat: {
    [index: string]: any;
}) => {
    if (!objectToFormat) {
    }
    let queryArray: any[] = [];

    for (const key in objectToFormat) {
        if (typeof objectToFormat[key] === "string") {
            queryArray.push(`${key} = '${objectToFormat[key]}'`);
        } else {
            queryArray.push(`${key} = ${objectToFormat[key]}`);
        }
    }
    const queryString = queryArray.join(", ");
    return queryString;
};
