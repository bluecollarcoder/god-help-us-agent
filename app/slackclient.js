var request = require('request');
var Q = require('q');

module.exports = {
  'sendMessage' : function(sender, message) {
    var url = 'https://hooks.slack.com/services/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';
    var data = {
      "payload": '{"channel": "#support", "username": "' + sender.name + '", "text": "' + message + '", "icon_emoji": ":exclamation:"}'
    };
    var deferred = Q.defer();
    console.log('SENDING MESSAGE ' + message);
    request.post({
      url: url,
      formData: data
    }, function (error, response, body) {
      console.log(body);
      if (!error && response.statusCode == 200) {
        console.log('Message sent');
        deferred.resolve();
      } else {
        console.log('Message not sent');
        deferred.reject(error);
      }
    });
    return deferred.promise;
  }
};
