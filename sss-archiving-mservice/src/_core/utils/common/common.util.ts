export const isEmpty = (value: any) => {
    if (value === undefined || value === null || value === '') {
        return true;
    }

    if (typeof value === 'string' || Array.isArray(value)) {
        return value.length === 0;
    }

    if (typeof value === 'object') {
        return Object.keys(value).length === 0;
    }

    return false;
};

export const convertToISODate = (dateString: string) => {
    const dateParts = dateString.split('/');
    return dateParts.length === 3 ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` : null;
};