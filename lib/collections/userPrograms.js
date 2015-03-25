UserPrograms = new Meteor.Collection('userPrograms');

UserPrograms.findOneForUser = function(program, userId) {
  var userProgram = UserPrograms.findOne({
    userId: userId,
    programId: program._id
  });
  if (userProgram === undefined) {
    userProgram = UserPrograms.new(program, userId);
    UserPrograms.insert(userProgram);
  }
  return userProgram;
};

UserPrograms.new = function(program, userId) {
  var userProgram = {
    programId: program._id,
    userId: userId,
    created: new Date(),
    lastSaved: new Date(),
    version: 1,
    code: program.code
  };

  return userProgram;
};