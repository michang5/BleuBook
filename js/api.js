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