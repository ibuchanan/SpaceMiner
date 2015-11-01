Template.play.helpers({
  level: function() {
    let id = 'starter';
    let query = Router.current().params.query;
    if (query && query.id) id = query.id;
    return id;
  }
});