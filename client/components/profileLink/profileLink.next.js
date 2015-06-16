Template.profileLink.helpers({
  userName: function() {
    return encodeURIComponent(Template.instance().data.name);
  }
})