const training = trainingId => editor('game', {
	_id: trainingId,
	code: '',
	context: {
	  level: trainingId,
	  enableSound: false,
	  buttons: ['gamePause', 'gamePlay', 'gameReset']
	}
  });

let moveDirections = `
<div class='well well-sm'>
<h2>move(direction(count), ...)</h2>

<p>Call this function to move the player <b>count</b> number of cells for the given <b>direction</b>. The <b>direction</b> may be <b>left, up, right, or down</b>. You can also use <b>l, u, r, or d</b> as shortcuts. This function will take any number of arguments and will keep moving the player until it has evaluated each argument.</p>

<h3>Usage examples</h3>

<div>
<p>To move the player 4 spaces to the left, followed by 2 up, 7 to the right and then 5 down, type this code:</p>
<p>
<code>move(left(4), up(2), right(7), down(5));</code>
</p>
<p>
You can also use the shortcut form like this:
<p>
<p>
<code>move(l(4), u(2), r(7), d(5));</code>
</p>

<h3>Alternative usage examples</h3>

<div>
<p>The ship can cloak itself (for 5 seconds) to look like an enemy, and can also fire (if you have collected one or more gems). Here's an example that may come in handy later on:</p>
<p><code>move(l(17), u(1), 'cloak', 'fire')</code></p>
</div></div>
`;

const env = {	
	training,
	moveDirections,
	chatExample() {
		return dynamo({
name:'message',
tabs: ['Template', 'Style','Result'],
template: `{{> message title="Comet Chat" author= "Comet, Inc."}}`,
style: `* .message-app {
	background: gray;
	color: white;
	padding: 10px;
	text-align: center;
	border: 10px solid gold; } 
* .message-input {
	background: yellow;
}
* .message-send {
	background: orange;
	text-transform: uppercase
}`,
data: ''});
	},

	dataExample() {
		return dynamo({
			name:'user-data',
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
}`});
	},

	tinyPrograms1() {
		return program('subtract', '4 - 2')
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
		+ program('modulus101', '102 % 3');
	},

	tinyPrograms2() {
		return program('lt1', '0 < 1')
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
		+ program('gte4', '55 >= 56');
	},

	equalityAndInequalityPrograms() {		
        return program('eq1', '1 === 1')
        + program('eq2', '1 === 2')
        + program('eq3', '4 === 4')
        + program('eq5', '5 === 50')
        + `Got it? Try these:${dbr}`
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
        + `OK, maybe it is a bit of a trick...but, try it anyway!`
	},

	stringPrograms() {
        return program('', `"Space Miner".length`)
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
greeting;`);
	}
};

markdownLesson('mission.md', 'mission', env);