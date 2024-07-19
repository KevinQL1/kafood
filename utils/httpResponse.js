export const ok = (body) => ({
    statusCode: 200,
    body,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const media = (data, headers) => ({
    statusCode: 200,
    body: data.toString('base64'),
    isBase64Encoded: true,
    headers: {
        'content-type': headers['content-type']
    }
});

export const badRequest = (error) => (path = '/') => ({
    statusCode: 400,
    body: {
        type: 'urn:problem:bad-request',
        title: 'Bad Request',
        detail: error.message,
        status: 400,
        instance: path
    },
    headers: {
        'Content-Type': 'application/problem+json'
    }
});

export const unauthorized = (error) => (path = '/') => ({
    statusCode: 401,
    body: {
        type: 'urn:problem:unauthorized',
        title: 'Unauthorized',
        detail: error.message,
        status: 401,
        instance: path
    },
    headers: {
        'Content-Type': 'application/problem+json'
    }
});

export const forbidden = (error) => (path = '/') => ({
    statusCode: 403,
    body: {
        type: 'urn:problem:forbidden',
        title: 'Forbidden',
        detail: error.message,
        status: 403,
        instance: path
    },
    headers: {
        'Content-Type': 'application/problem+json'
    }
});

export const notFound = (error) => (path = '/') => ({
    statusCode: 404,
    body: {
        type: 'urn:problem:not-found',
        title: 'Not Found',
        detail: error.message,
        status: 404,
        instance: path
    },
    headers: {
        'Content-Type': 'application/problem+json'
    }
});

export const conflict = (error) => (path = '/') => ({
    statusCode: 409,
    body: {
        type: 'urn:problem:conflict',
        title: 'Conflict',
        detail: error.message,
        status: 409,
        instance: path
    },
    headers: {
        'Content-Type': 'application/problem+json'
    }
});

export const serverError = (path = '/') => ({
    statusCode: 500,
    body: {
        type: 'urn:problem:server-error',
        title: 'Server Error',
        detail: 'An unexpected error has occurred, contact the administrator.',
        status: 500,
        instance: path
    },
    headers: {
        'Content-Type': 'application/problem+json'
    }
});
