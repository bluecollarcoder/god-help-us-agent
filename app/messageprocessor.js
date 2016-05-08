var watson = require('watson-developer-cloud');
var _ = require('underscore');
var Q = require('q');
var SlackClient = require('./slackclient');
var ResponseGuide = require('./responseguide');

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
  'analyze' : function(chat, chatMsg) {
    var sender = chatMsg.sender;
    var messages = chat.filterMessagesBySender(sender);
    var txtMsg = _.pluck(messages, 'message').join('\n');

    var deferred = Q.defer();
    tone_analyzer.tone({ text: chatMsg.message }, function(err, tone) {
      if (err)
        deferred.reject(err);
      else {
        var meta = {
          tone : new ToneMeta(tone)
        };

        var diff = compareTone(chat.meta.tone, meta.tone);
        chatMsg.meta.tone = {
          diff : diff
        };
        var overLimit = _.pick(diff, function(_val, _key) {
          return _val > 0.2;
        });

        chatMsg.suggestedResponses = ResponseGuide.getResponse(diff);

        if (!_.isEmpty(overLimit)) {
          var tokens = _.keys(overLimit);
          SlackClient.sendAlert(
            'GodHelpUs Chat Bot',
            sender.name + '\'s *' + tokens.join(', ') + '* ' + (tokens.length > 1 ? 'have' : 'has') + ' increased.',
            chatMsg.suggestedResponses
          );
        }

        deferred.resolve(meta);
      }
    });
    return deferred.promise;
  }
};

var compareTone = function(previous, current) {
  var d = {
    anger : 0,
    disgust : 0,
    fear : 0,
    joy : 0,
    sadness : 0
  };

  if (!previous || !current) {
    return d;
  }

  var prevScores = {}, currScores = {};
  var currCategory = _.filter(current.tone_categories, function(_cat) {
    return _cat.category_id === 'emotion_tone';
  })[ 0 ];
  var prevCategory = _.filter(previous.tone_categories, function(_cat) {
    return _cat.category_id === 'emotion_tone';
  })[ 0 ];

  _.chain(d).keys().each(function(_key) {
    var prevTone = _.filter(prevCategory.tones, function(_tone) {
      return _tone.tone_id === _key;
    })[ 0 ];

    var currTone = _.filter(currCategory.tones, function(_tone) {
      return _tone.tone_id === _key;
    })[ 0 ];

    d[ _key ] = currTone.score - prevTone.score;
  });

  return d;
};
