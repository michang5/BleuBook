function api(url, data, succeed, failed) {
    axios.post(url, data).then(function (result) {
        if (result.data.code == 0) return succeed? succeed(result): true;
        if (failed) return failed(result);
        alert(result.data.message);
        return false;
    }).catch(function (error) {
        if (failed) return failed(error);
        alert(error);
        return false;
    });
}

function get(key, value) {
    if (!localStorage[key]) localStorage[key] = JSON.stringify(value);
    return JSON.parse(localStorage[key]);
}

function set(key, value) {
    localStorage[key] = JSON.stringify(value);
}