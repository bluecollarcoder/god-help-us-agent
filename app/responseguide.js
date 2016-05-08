var _ = require('underscore');

var rules = [{
  key : 'fear',
  minDiff : 0.2,
  responses : [
    'Don\'t worry, I can help you with this.'
  ]
}, {
  key : 'anger',
  minDiff : 0.2,
  responses : [
    'I\'m sorry to upset you. Let me try again to help you.',
    'I can see that you are getting upset. Let me try to see if we can find another solution to this problem.'
  ]
}, {
  key : 'sadness',
  minDiff : 0.2,
  responses : [
    'I\'m sorry to upset you. Let me know what I can do to help.',
    'I understand that it is a difficult situation, I will try my best to help.'
  ]
}];

module.exports = {
  getResponse : function(diff) {
    var responses = _.chain(rules).filter(function(rule) {
      var dScore = diff[ rule.key ];
      return (rule.minDiff && dScore > rule.minDiff || rule.maxDiff && dScore < rule.maxDiff);
    }).pluck('responses').flatten().value();
    return responses;
  }
};
