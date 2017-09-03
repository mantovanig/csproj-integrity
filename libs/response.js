module.exports = function(status, message, data) {
    return JSON.stringify({
        status: status,
        message: message ? message : "",
        data: data ? data : ""
    });
}