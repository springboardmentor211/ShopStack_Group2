export const clone = (value) => JSON.parse(JSON.stringify(value));

export const wait = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));
