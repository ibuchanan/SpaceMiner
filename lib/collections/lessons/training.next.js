function training(trainingId) {
  return editor('game', {
    _id: trainingId,
    code: '',
    context: {
      level: trainingId,
      enableSound: false,
      buttons: ['gamePause', 'gamePlay', 'gameReset']
    }
  });
}

Lessons.add({
  _id: 'training',
  title: 'Training',
  sections: [
    sec('Training basics',
        `These training levels help you learn to write code by calling functions and writing your own functions. Here's how you can control the player with code:${dbr}
<h2>player.move('count direction', ...)</h2>

<p>Call this function to move the player <b>count</b> number of cells for the given <b>direction</b>. The <b>direction</b> may be <b>left, up, right, or down</b>. You can also use <b>l, u, r, or d</b> as shortcuts. This function will take any number of arguments and will keep moving the player until it has evaluated each argument.</p>

<h3>Usage examples</h3>

<div>
<p>To move the player 4 spaces to the left, followed by 2 up, 7 to the right and then 5 down, type this code:</p>
<p>
<code>game.player.move('4 left', '2 up', '7 right', '5 down');</code>
</p>
<p>
You can also use the shortcut form like this:
<p>
<p>
<code>game.player.move('4 l', '2 u', '7 r', '5 d');</code>
</p>

<h3>Alternative usage examples</h3>

<div>
<p>To make the player ship move 17 spaces left, turn upward, cloak itself (for 5 seconds) to look like an enemy, and then fire, try this:</p>
<p><code>game.player.move('17 l', '1 u', 'cloak', 'fire')</code></p>
</div>
`),
    sec('Motion', training('motion')),
    sec('Maze', training('maze')),
    sec('Mighty Square', training('mightySquare')),
    sec('Mightier Squares', training('mightierSquares')),
    sec('Rectangles', training('rectangles')),
    sec('Rows', training('rows')),
    sec('Columns', training('columns')),
    sec('Jumps', training('jumps')),
    sec('Box Step', training('boxStep')),
    sec('Crazy Boxes', training('crazyBoxes'))
  ]
})