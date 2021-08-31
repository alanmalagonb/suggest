import { format } from "timeago.js";

export const timeago = (savedTimestamp) => {
    return format(savedTimestamp, 'es');
};

export const isPending = (status) => {
    return status === 1;
};

export const isAccepted = (status) => {
    return status === 2;
};

export const isDenied = (status) => {
    return status === 3;
};

export const isUrl = (url) => {
    return url.includes('http');
};

export const isEmpty = (votes) => {
    return votes === 0;
}

export const isPositive = (votes) => {
    return votes > 0;
}