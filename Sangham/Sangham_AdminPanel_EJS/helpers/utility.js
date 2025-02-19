//------ Notification -----//

exports.send_fcm_notifications = function (Title, Text, Tokens, ClickAction) {
    var FCM = require('fcm-node');
    var serverKey = 'AAAAegNg_OY:APA91bE8G9R4d90HSU1ZuawtOMawfqslOiLPA3Ih7YXiox1WFxCN6uwO6BDtbPY2lsH9Eoa8pUB_Yb7-Q4TjiSJ-YH_7E5DKrN50lwz8AmV09Lm7QpR_o3zDVz-AYDYC3Yk-dfBZUDHO';
    var fcm = new FCM(serverKey);
    var Tokens = Tokens
    if (typeof Tokens === 'string') {
        Tokens = [Tokens]
    }
    var message = {
        registration_ids: Tokens,
        collapse_key: '',

        notification: {
            title: Title,
            body: Text,
            click_action: ClickAction,
        }
    };
    fcm.send(message, function (err, response) {
        console.log(message)
        if (err) {
            console.log("res", err);
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
};
