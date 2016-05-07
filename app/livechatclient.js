'use strict';

var Q = require('q');
var LiveChatApi = require('livechatapi').LiveChatApi;
var api = new LiveChatApi('ioessdeveloper@gmail.com', '113b93f17b4ef585160d964b7316a884');
var request = require('request');
var uuid = require('node-uuid');

module.exports = {
  'startAgent' : function(login, name) {
    var deferred = Q.defer();
    api.agents.get(login, function(data){
      if (data.error) {
        console.log('CREATING AGENT...');
        api.agents.create({
          login : login,
          name : name
        }, function(data) {
          if (data.error) {
            deferred.reject(JSON.parse(data.error));
          } else {
            deferred.resolve(data);
          }
        });
      } else {
        deferred.resolve(data);
      }
    });
    return deferred.promise;
  },
  'startClient' : function(visitorId, email, name) {
    var url = 'https://api.livechatinc.com/visitors/' + visitorId + '/chat/start';
    var data = {
      licence_id : '7477711',
      welcome_message : 'Hello'
    };
    if (email) {
      data.email = email;
    }
    if (name) {
      data.name = name;
    }
    var deferred = Q.defer();
    console.log('STARTING CLIENT');
    request.post({
      url: url,
      headers : {
        'X-API-Version' : 2
      },
      formData: data
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var obj = JSON.parse(body);
        deferred.resolve(obj.secured_session_id);
      } else {
        deferred.reject(error);
      }
    });
    return deferred.promise;
  }
};
