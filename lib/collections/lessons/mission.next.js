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
  _id: 'mission',
  title: 'Your mission to save the galaxy',
  description: 'Send an SOS from deep space, using the basics of programming language expressions.',
  topics_main: ['chat rooms', 'apps', 'markup', 'style', 'data', 'motion'],
  topics_sub: ['templates', 'HTML', 'CSS', 'JSON'],
  sections: [
    sec('Lost in the cosmos', {description:`On July 20th, 2269 humanity received a distant cry for help`},
      [`A cry for help`, `Late at night on July 20th, 2269, exactly 300 years from the date that human beings landed on the Moon, you are sitting comfortably in your office on the Moon, within the <a href='http://www.haydenplanetarium.org/tyson/' target='_blank'>Neil deGrasse Tyson Lunar Station</a>. You're reviewing the messages collected by the <a href='/intergalactiChat' target='_blank'>IntergalactiChat</a> app you had recently built. After building the app you shared the link with humans living on Mars, the Moon, Earth, and other distant locations. They started sharing humorous messages and the occassional request for help in your chat room app.
${dbr}
It was just another ordinary night until you saw the following message pop up:
${dbr}
<ul class='list-group'>
  <li class='list-group-item'><span class="label label-warning">Unknown</span> Help us, Earthlings! <small class='text-muted'>sent 10,000 years ago</small></li>
</ul>
You are amused that the system reports the message as having been sent 10,000 years ago. Messages from Mars, depending on how far away it is at the time, usually take between 3 and 22 minutes. Even messages near <a href='http://www.pbs.org/seeinginthedark/astronomy-topics/light-as-a-cosmic-time-machine.html' target='_blank'>Jupiter take an averages of just 43 minutes to reach the Moon and Earth</a>!
${dbr}
You think it must be a trick played by a near-earth astronaut, and decide to send a reply.`],
        ['Chat across the galaxy', `When you built <a href='/intergalactiChat' target='_blank'>IntergalactiChat</a>, you made it easy for users to send messages to each other or to everyone all at once, like any <a href='https://en.wikipedia.org/wiki/Chat_room' target='_blank'>classic chat room since the late 1900s</a> has allowed. You also made it easy for others to communicate with the chat room from their spacecraft consoles, spacesuits, touch-screen devices, and many other devices. You made it so that any time they wanted to send a message, they could include a message box and a button like below:
${dbr}` + messageInput() + `${dbr}<article class='well well-sm'><small>Computers, phones, tablets, and other devices like cars, boats, jets, and, especially, spacecraft, that run programs and scripts may be powerful, but by themselves they don't know what their designers want them to do. Even the most powerful computers in the world still need <b>input</b> from intelligent human beings or other computers that have been pre-programmed before they do or produce anything useful.</small></article>`],
        ['Add chat message app to your profile', `Being your first customer is always a wise idea, so you decide to embed the message app into your profile. Here's the code to do it. You may customize the properties and styles however you want. Just make sure to hit the Save Changes button after you like the changes you've made.${dbr}` + dynamo({name:'message',
template: `{{> message title="Comet Chat" author= "Comet, Inc." }}`,
style: `* .message-app {
  background: gray;
  color: white;
  padding: 10px;
  text-align: center;
  border: 10px solid gold;
}
* .message-input {
  background: yellow;
}
* .message-send {
  background: orange;
  text-transform: uppercase
}`,
data: ''
        })],
        ['Add data to your profile', `You added the ability for your users to show custom data about themselves, like their home planet or station, favorite sport, favorite foods, and more, using simple HTML, CSS, and JSON data, which has been popular since the early 2000s. Try adding your own data to your profile now. You can start on the <b>Data</b> tab first just to modify the information, then try to modify the code in the <b>Template</b> and <b>Style</b> tabs if you want extra customization:` +
        dynamo({name:'user-data',
  tabSelected: 'data',
  template: `<div>
 {{#if name}}
 <h3>Name</h3>
 {{name}}
 {{/if}}

 <h3>Visited Jupiter?</h3>
 {{#if hasVisitedJupiter}}
  I have visited Jupiter!
 {{else}}
  I have never visitied Jupiter.
 {{/if}}

 {{#if birthDate}}
 <h3>Birthday</h3>
 {{birthDate.month}}/{{birthDate.day}}/{{birthDate.year}}
 {{/if}}

 {{#if homePlanet}}
 <h3>Home Planet</h3>
 {{homePlanet.name}}
 {{#if homePlanet.imageUrl}}
    <img src="{{homePlanet.imageUrl}}" />
 {{/if}}
 {{/if}}

 {{#if faveSport}}
 <h3>Favorite Sport</h3>
 {{faveSport}}
 {{/if}}

 {{#if favoriteFoods}}
 <h3>Favorite Foods</h3>
 <ul>
  {{#each favoriteFoods}}
  <li>{{this}}</li>
  {{/each}}
 </ul>
 {{/if}}

</div>`,
style:`* {
background: midnightblue;
color: lightblue;
padding: 8px;
border: 16px ridge purple;
}

* h3 {
 color: orange;
}`,
data: `{
 "name": "Your Name",
 "birthDate": {
   "month": 1,
   "day": 20,
   "year": 2005
 },
 "faveSport": "Moonball",
 "homePlanet": {
  "name": "Mars",
  "imageUrl": "http://denali.gsfc.nasa.gov/research/mars/mars_icon.gif"
 },
 "favoriteFoods": [
   "Cookies",
   "Carrots",
   "Burgers"
   ]
}`
               })]
        ), sec('Moving around on distant worlds', {description:`Learn how to control your ship, weapons, and defenses with code`},
        ['Move your ship',`Your mission will soon be to explore distant worlds and to program robotic explorers to avoid enemies and collect materials to power the galactic defense. To do this, you need to practice the basics of programming your ship to operate on auto-pilot.${dbr}
Here's how you can control the player ship with code:${dbr}
<div class='well well-sm'>
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
<p>The ship can cloak itself (for 5 seconds) to look like an enemy, and can also fire (if you have collected one or more gems). Here's an example that may come in handy later on:</p>
<p><code>game.player.move('17 l', '1 u', 'cloak', 'fire')</code></p>
</div></div>
${dbr}
Try now to move the ship with code aroud this simple world:${dbr}` + training('motion')],
        ['Navigate challenging spaces', `Try now to move your ship, with code, around another world.${dbr}

Here are the directions again for your reference:${dbr}
<div class='well well-sm'>
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
<p>The ship can cloak itself (for 5 seconds) to look like an enemy, and can also fire (if you have collected one or more gems). Here's an example that may come in handy later on:</p>
<p><code>game.player.move('17 l', '1 u', 'cloak', 'fire')</code></p>
</div></div>` + training('maze')],
               ['Enemies beware', `Now that you have some basic moves down, write the code to maneuver your ship to the left, turn upward, then fire to destroy the enemy.${dbr}
Here are the directions again for your reference:${dbr}
<div class='well well-sm'>
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
<p>The ship can cloak itself (for 5 seconds) to look like an enemy, and can also fire (if you have collected one or more gems). Here's an example that may come in handy later on:</p>
<p><code>game.player.move('17 l', '1 u', 'cloak', 'fire')</code></p>
</div></div>` + training('easyTarget')]
    ),
    sec('Sharpen your coding tools', {description:`Practice some coding fundamentals that you'll need to craft your automated explorations`},
        ['Hello, Universe: A tiny, complete program', `Here's a very brief computer program written in the <b>JavaScript</b> programming language. JavaScript has, since its introduction in the Netscape web browser in 1996, become one of the most popular programming languages in the world. JavaScript is built-in to all web modern web browsers that run on desktops, laptops, phones, and tablet devices: ${dbr}
Study this code for a moment before continuing. What do you think it's going to do just by looking at it?
${dbr} <pre><code>message("Hello, Universe!")</code></pre>`],
        ['Executing a tiny program', `Here's the same program again. Do you have an hypothesis about what it will do yet? You don't have to know exactly what it will do, just a rough idea. Once you've thought of something, test your hypothesis by pressing the <b>Execute</b> button to run it:
${dbr}` + program('message', 'message("Hello, Universe!")')],
        ['Evaluate your hypothesis', `What did the program do? How did that compare to what you expected it to do?`],
        ['Another tiny program', `Here's another brief program. Study this one and form another hypothesis about what this one will do before pressing the continue button.
${dbr}
<pre><code>message(1 + 1)</code></pre>
`],
        ['Execute the program', `Once again, here's the program you just saw. Once you have your hypothesis about what it's going to do, press the <b>Execute</b> button to test your hypothesis:
${dbr}` + program('add', 'message(1 + 1)', true)],
        ['Evaluate your hypothesis', `What did the program do this time? How did it compare to what you expected?`],
        ['Review', `In the first program, the program sent the text <b>Hello, Universe!</b> to the <b>IntergalactiChat</b> app. In the second example, the program first performed a simple <b>addition operation</b> and then sent the resulting number <b>2</b> to the <a href='/intergalactiChat' target='_blank'>IntergalactiChat</a> chat room. In both of these examples, <code>message</code> is a <b>function</b>.${dbr}
A <b>function</b> is a reusable peice of code that you can <b>pass values</b>, known as arguments, into and have it carry out some work for you or give you back a different value based on what you gave it. The <b>message</b> function simply takes whatever argument value you send it and then sends it into outerspace for <a href='/intergalactiChat' target='_blank'>IntergalactiChat</a> to display for everyone to see. Handy, right?
${dbr}
Functions are an important topic, but many programs can be even simpler than this. In fact, <code>"Hello, world!"</code>, even without the surrounding <code>message()</code> function is a program all by itself. So is <code>1 + 1</code>. Keep reading to see many more tiny programs.`]
    ),
    sec('Programs start tiny', {description: 'Just like some complete sentences are only one or a few words, so too can complete programs be very small, and studying small programs helps you learn how to build bigger ones!'},
        
        ['Short math expressions as programs', `Here are several more small programs. Look at each one and try to form an hypothesis about what it will do before you execute it. Don't worry if some of them are difficult. You will learn all about these soon enough!
${dbr}
<i>Try these one by one first as explained above, but you can come back later and execute or reset all of them at once with these buttons:</i> ` + sampleProgramExecAll() + `${dbr}` +
        program('subtract', '4 - 2')
        + program('divide1', '8 / 4')
        + program('divide2', '16 / 4')
        + program('multiply1', '4 * 2')
        + program('multiply2', '8 * 4')
        + program('modulus1', '1 % 3')
        + program('modulus2', '2 % 3')
        + program('modulus3', '3 % 3')
        + program('modulus5', '4 % 3')
        + program('modulus6', '5 % 3')
        + program('modulus7', '6 % 3')
        + program('modulus8', '9 % 3')
        + program('modulus9', '10 % 3')
        + program('modulus10', '12 % 3')
        + program('modulus100', '100 % 3')
        + program('modulus101', '102 % 3')
        ]
        ,
        
        ['Modulus magic',`You've just executed lots and lots of programs! As you probably learned, all of them involved numbers and basic mathematical operations that you probably know already. But, what was happening with that <code>%</code> one that you had to execute so many times? What does that do?`],

        ['Number comparison programs', `Here are a bunch of other small programs for you to execute:
${dbr}
`
        + program('lt1', '0 < 1')
        + program('lt2', '1 < 0')
        + program('gt1', '1 > 0')
        + program('gt2', '0 > 1')
        + program('lt3', '900 < 1000')
        + program('gt3', '900 > 1000')
        + `${dbr}Stumped yet? How about these:${dbr}`
        + program('lte1', '-5 <= 55')
        + program('lte2', '5 <= 55')
        + program('lte5', '-565 <= 55')
        + program('lte6', '56 <= 55')
        + `${dbr}You are on a roll. Keep going:${dbr}`
        + program('gte1', '55 >= -5')
        + program('gte2', '55 >= 5')
        + program('gte3', '55 >= -565')
        + program('gte4', '55 >= 56')],

        ['Equality and inequality programs', `You are doing great, so let's try some more small programs. Think about what each of the following might produce and then try them to test your hypotheses:${dbr}`
        + program('eq1', '1 === 1')
        + program('eq2', '1 === 2')
        + program('eq3', '4 === 4')
        + program('eq5', '5 === 50')
        + `Got it? Try these:
        ${dbr}`
        + program('eq9', '2 + 2 === 4')
        + program('eq10', '2 * 2 === 4')
        + program('eq11', '1 + 1 + 1 + 1 === 4')
        + program('eq12', '1 + 1 + 2 === 4')
        + program('eq13', '1 + 2 + 1 !== 4')
        + program('eq14', '16 / 4 === 4')
        + `Still more? Yep, still more:${dbr}`
        + program('eq15', '9 % 3 === 0')
        + program('eq16', '4 % 3 === 1')
        + program('eq17', '100 % 3 === 1')
        + program('eq18', '5 % 3 !== 1')
        + `And one more that is not a trick question:${dbr}`
        + program('eq19', '0 / (8 * 9 - 77 % 6 + 4 * 22 ) === 0')
        + `OK, maybe it is a bit of a trick...but, try it anyway!`],

        ['String functions preview', `Now, we're going to get into more complex code. Don't worry if these don't make sense at first. Just try to get the hang of it.`
        + program('', `"Space Miner".length`)
        + program('', `"ASTEROID".toLowerCase()`)
        + program('', `"pebble".toUpperCase()`)
        + program('', `"             taking up space             ".trim()`)
        + program('', `"Vacation is in ".concat("the summer!")`)
        + program('', `"Vacation is in " + "the summer!"`)
        + program('', `"cccgggtcccgggeccgt".indexOf("e")`)
        + program('', `"cccgggtcccgggeccgt".indexOf("t")`)
        + program('', `"cccgggtcccgggeccgt".lastIndexOf("t")`)
        + program('', `"abcde".charAt(0)`)
        + program('', `"abcde".charAt(1)`)
        + program('', `"abcde".charAt(4)`)
        + program('', `"abcde".substr(1, 4)`)
        + program('', `"abcde".substring(1, 4)`)
        + program('', `"Vacation is in the summer!".slice(0, 8)`)
        + program('', `"Vacation is in the summer!".slice(-7)`)
        + program('', `"Vacation is in the summer!".slice(5, 12)`)
        + program('', `"Vacation is in the summer!".slice(9, -2)`)
        + program('', `"Mi?i?ippi".replace("?", "ss")`)
        + program('', `"Mi?i?ippi".replace(/\\?/g, "ss")`)
        + program('',
                  `var x = [];
x.push("one");
x.push("two");
x;`)
        + program('', `var me = {
"name": "Josh",
"likesCandy": true,
"birthDate": new Date("July 20 1977"),
"numberOfPets": 0,
"favoriteFoods": ["Burritos", "Cookies", "Spinach"]
};
me;`)
        + program('',
                  `console.log("Hello!");
console.log("Hello!");
console.log("Hello!");
console.log("Hello!");
console.log("Hello!");
console.log("Hello!");
console.log("Hello!");
console.log("Hello!");
console.log("Hello!");
console.log("Hello!");`)
        + program('',
                  `var count = 1;
while (count < 11) {
console.log("Hello!");
count = count + 1;
}`)
        + program('',
                  `var count = 1;
while (count++ < 11) console.log("Hello!");`)
        + program('',
                  `console.log("Hello for the first time!");
var count = 1;
while (++count < 11) console.log("Hello times " + count + "!");`)
        + program('', `var greeting = "Hello!";
var count = 1;
while(count < 11) greeting = greeting + "Hello times " + count++;
greeting;`)
        + program('', `var greeting = "Hello!";
var count = 1;
while(count < 11) greeting = greeting + "\\nHello times " + count++;
greeting;`)]
    )
  ]
});
