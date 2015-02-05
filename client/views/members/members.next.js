var bsBackgrounds = [
  'primary', 'success', 'info', 'warning', 'danger'
];

var icons = [
  'tree', 'truck', 'umbrella', 'wrench', 'space-shuttle', 'taxi', 'spoon', 'ship', 'institution', 'fire-extinguisher', 'car', 'anchor', 'bomb', 'bicycle', 'ambulance', 'bolt', 'rocket'
];

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

Template.members.helpers({
  members: function() {
     return Router.current().data(); 
  },
  randomBackgroundColor: function() {
    return randomElement(bsBackgrounds);
  },
  randomIcon: function() {
    return randomElement(icons);
  }
});