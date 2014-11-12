var hideClass = 'hideElement';
var showClass = '';

hideIfTrue = function(pred) {
  if (_.isBoolean(pred)) return pred === true ? hideClass : showClass;
  if (!_.isObject(pred)) return hideClass;
  return function() {
    return pred.get() === true ? hideClass : showClass;
  };
};

showIfTrue = function(pred) {
  if (_.isBoolean(pred)) return pred === true ? showClass : hideClass;
  if (!_.isObject(pred)) return hideClass;
  return function() {
    return pred.get() === true ? showClass : hideClass;
  }
};
