const hideClass = 'hidden';
const showClass = '';
const showForceClass = 'show';

export function hideIfTrue(pred) {
  if (_.isBoolean(pred)) return pred === true ? hideClass : showClass;
  if (!_.isObject(pred)) return hideClass;
  return () => pred.get() === true ? hideClass : showClass;
};

export function showIfTrue(pred) {
  if (_.isBoolean(pred)) return pred === true ? showClass : hideClass;
  if (!_.isObject(pred)) return hideClass;
  return () => pred.get() === true ? showClass : hideClass;
};

export function showForceIfTrue(pred) {
  if (_.isBoolean(pred)) return pred === true ? showForceClass : hideClass;
  if (!_.isObject(pred)) return hideClass;
  return () => pred.get() === true ? showForceClass : hideClass;
};