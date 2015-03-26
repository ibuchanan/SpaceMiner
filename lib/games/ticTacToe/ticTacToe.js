GameTicTacToe = new Meteor.Collection('GameTicTacToe');

GameTicTacToe.updateGame = function(gameState) {
  GameTicTacToe.update(gameState._id, { $set: _.omit(gameState, '_id') });
};