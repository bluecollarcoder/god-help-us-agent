var watson = require('watson-developer-cloud');
var _ = require('underscore');
var Q = require('q');

var tone_analyzer = watson.tone_analyzer({
  username: '757794f3-4b24-4b8e-aa8e-a71921e0ad20',
  password: 'jZ7Tv66NbupN',
  version: 'v3-beta',
  version_date: '2016-02-11'
});

var ToneMeta = function(json) {
  _.extend(this, json.document_tone);
};
ToneMeta.prototype.constructor = Object.create(ToneMeta.prototype);

module.exports = {
  'analyze' : function(messages) {
    var txtMsg = _.pluck(messages, 'message').join('\n');

    var deferred = Q.defer();
    tone_analyzer.tone({ text: txtMsg }, function(err, tone) {
      if (err)
        deferred.reject(err);
      else {
        var meta = {
          tone : new ToneMeta(tone)
        };
        deferred.resolve(meta);
      }
    });
    return deferred.promise;
  }
};
