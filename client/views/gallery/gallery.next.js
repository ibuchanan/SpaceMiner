Router.map(function() {
  this.route('gallery', {
    path: '/gallery/:itemName',
    layoutTemplate: 'mainLayout',
    data: function() {
      return UserDynamos.find({name:this.params.itemName});
    }
  });
});

Template.gallery.helpers({
  items: function() {
    return Router.current().data();
  },
  userName: function() {
    return Meteor.users.findOne({_id: this.userId}).profile.nickName;
  }
});