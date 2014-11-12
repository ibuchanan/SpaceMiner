// Depends on multiple-callbacks and Bus
AutoSignal = {
  register: function(templateName, signals) {
    var signalObjects = {};
    _.each(signals, function(handler, signalName) {
      var signal = Bus.signal(signalName);
      Template.created(templateName, function() {
        signal.add(handler);
      });
      Template.destroyed(templateName, function() {
        signal.remove(handler);
      });
      signalObjects[signalName] = signal;
    });
    return signalObjects;
  }
};