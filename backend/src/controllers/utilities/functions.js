module.exports = {
    formatDate(today){
        var year = today.getFullYear();
        var month = today.getMonth() + 1;
        var day = today.getDate();
        var hours = today.getHours();
        var minutes = today.getMinutes();
        var seconds = today.getSeconds();

        return year + "-" + month + "-" + day + " " 
        + hours + ":" + minutes + ":" + seconds;
    }

}