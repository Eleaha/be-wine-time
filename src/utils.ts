export const formatPatchString = (objectToFormat: {[index: string]: any}) => {
    if (!objectToFormat) {
        return ""
    }
    let queryString: string = ''

    for (const key in objectToFormat) {
        queryString = queryString + `${key} = "${objectToFormat[key]}", `
    }

    return queryString
}