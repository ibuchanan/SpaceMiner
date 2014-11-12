Bus = {
  _signals: {},
  signal : function(name) {
    if (this._signals[name]) return this._signals[name];
    this._signals[name] = new signals.Signal();
    return this._signals[name];
  }
};