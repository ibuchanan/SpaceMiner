this.trainingMission = {
  "_id": "createWorld",
  "project": "Create your own world!",
  "steps": [
    {
      "ccode": "var worldName = \"Space Miner\";",
      "title": "Naming your creation",
      "intro": "Have you noticed that planets, moons, and other astronomical phenomena, like craters and asteroids, are named after ancient gods or the human beings who discovered them? Jupiter, Mars, and Tyson come to mind. Why should your creation be any different? Feel free to name your world anything you'd like.",
      "sections": [
        {
          "text": "Congratulations, you're ready to create a new world for miners to explore! Follow these steps to give your new world a name:",
          "type": "paragraph"
        },
        {
          "instructions": [
            {
              "step": "Type the code you see below into the <b>Code Editor</b> to your right, but replace the words <code>Space Miner</code> with a name of your own choosing.<br /><br />" +
`<pre><code>var worldName = "Space Miner";</code></pre>`,
              "tips": "Be careful to leave both of the double-quote characters, <code>\"</code> and <code>\"</code>, surrounding your new world's name. And, make sure you end the line with the semi-colon character, <code>;</code>. This tells the program that you are finished with that <b>code statement</b>."
            }
          ],
          "type": "instructions"
        },
        {
          "observations": [ 
            {
              "observation": "First, notice the text <code>var</code>. You use <code>var</code> to <b>declare</b> your own variables in the programs you write. Declaring a variable lets you reserve a spot of memory for the computer to remember things you need it to remember.",
              "explanation": "The three letters <code>var</code> are a JavaScript language <b>keyword</b>. Keywords are special, reserved words that the language uses to translate your code into action. In other words, you use keywords to bring your programs to life!"
            },
            {
              "observation": "Next, notice that we named our variable <code>worldName</code>, being careful not to have any space characters in the variable name.",
              "explanation": "There are several rules for variable names:\n<ul>\n<li>They must start with a letter, or an <code>_</code> or <code>$</code> character.</li>\n<li>After the first character, they can contain letters, digits, <code>_</code>, <code>$</code>, or <code>-</code> characters.</li>\n</ul><br />Examples of valid variable names are: <ul><li><code>cool</code></li><li><code>$lotsOf$Money</code></li><li><code>_temp</code></li><li><code>num1</code></li><li><code>first-name</code></li><li> <code>First_Name</code></li></ul><br />Examples of invalid variable names are: <ul><li><code>1stPlace</code></li><li><code>-temp</code></li><li><code>first.name</code></li><li><code>^batMan^</code></li><li><code>@SpaceMiner@</code></li></ul>"
            }
          ],
          "type": "observations"
        }
      ]
    },
    {
      "ccode": "var explorerName = \"Ninja Coder\";",
      "title": "Claim your explorerhood!",
      "intro": "As an explorer and creator of new worlds, don't you want everyone to know that you were the first human being to explore this corner of the universe?",
      "sections": [
        {
          "text": "To tell everyone else that you are this world's chief creator and explorer, you'll declare another variable.",
          "type": "paragraph"
        },
        {
          "instructions": [
            {
              "step": "On a new line below the code you just typed, type the new code that you see below into the <b>Code Editor</b>, but replace the words <code>Ninja Coder</code> that is being assigned to the <code>explorerName</code> variable with your own name, or some fictional nickname if you'd prefer.<br/><br/><pre><code>var explorerName = \"Ninja Coder\";</code></pre>",
              "tips": "Again, be careful to leave both of the double-quote characters, <code>\"</code> and <code>\"</code>, surrounding the new value."
            }
          ],
          "type": "instructions"
        }
      ]
    },
    {
      "ccode": "var numberOfLives = 1;",
      "title": "Extend your lifetime with futuristic technology",
      "intro": "In the future, when you explore new planets, moons, and asteroids, you can take advantage of all that future technology, like the ability to come back to life after an enemy gobbles you up!",
      "sections": [
        {
          "text": "To tell everyone else that you are this world's chief creator and explorer, you'll declare another variable.",
          "type": "paragraph"
        },
        {
          "instructions": [
            {
              "step": "Like before, start a new line in the <b>Code Editor</b> below the previous one, and type in the new code that you see below, this time replacing the digit <code>1</code> being assigned to the <code>numberOfLives</code> variable with a digit greater than <code>1</code>.<br/><br/><pre><code>var numberOfLives = 1;</code></pre>",
              "tips": "This time, <b>do not</b> surround the digit value with any double-quote characters, and <b>do not use commas</b> if you do a number greater than 999! And, please don't use a negative number! It may break the system. But then again, maybe you can help us fix it if it does!"
            }
          ],
          "type": "instructions"
        }
      ]
    },
    {
      "ccode": "var enableEnemyRespawn = true;",
      "title": "Is it true or false that you'd like to cripple your enemies?",
      "intro": "In the future, enemies have technologies more advanced than you do! Do you feel like you're not up to the challenge of letting them come back to life?",
      "sections": [
        {
          "text": "If you don't think you can handle enemies that come back to life after you shoot them with your laser, then do this:",
          "type": "paragraph"
        },
        {
          "instructions": [
            {
              "step": "In the <b>Code Editor</b>, on a new line beneath the previous lines, type in the code below, but replace the value <code>true</code> being assigned to the <code>enableEnemyRespawn</code> variable with the exact value of <code>false</code>.<br/><br/><pre><code>var enableEnemyRespawn = true;</code></pre>",
              "tips": "<b>Do mot</b> surround the value with double-quote marks, and be sure to use all <b>lower-case</b> letters."
            }
          ],
          "type": "instructions"
        }
      ]
    },
    {
      "ccode": `var sprites = {
  tile : "fiery.png"
};`,
      "title": "Teraform your new world!",
      "intro": "Worlds can be fiery, icy, rocky, dusty, watery, forested, and more! How do you want yours to look?",
      "sections": [
        {
          "text": "If you remember, the borders and tiles of your world used to be made of watery plasma, but now they are fiery. That's because we're using a new kind of variable, of type <code>object</code>, that the program uses to keep track of the different image, or <i>sprite</i> graphics, that we want our world to contain. If you prefer the watery plasma over the fire, then do this:",
          "type": "paragraph"
        },   
        {
          "instructions": [
            {
              "step": "First type in the code you below into the <b>Code Editor</b> underneath the previous lines, then press the <b>Update world</b> button to see the change.<br/><br/>" +
`<pre><code>var sprites = {
  tile : "fiery.png"
};</code></pre>`
            },
            {
              "step": "Now, place these two identical characters <code>//</code> in front of the text <code>tile : \"fiery.png\"</code> so that it looks like <code>//tile : \"fiery.png\"</code>. These are comment characters, which tell the computer to ignore a single line of code.",
              "tips": "You can tell computer to ignore <b>multiple lines of code</b> by using <code>/*</code> and then </code>*/</code>, which you'll do in another step, so stay tuned."
            },
            {
              "step": "Once you've commented out that line, press the <b>Update world</b> button to see the change."
            },
            {
              "step": "Let's make one more change before moving on. First, remove the <code>//</code> comment characters, then add a comma, <code>,</code>,  to the end of that line so it looks like <code>tile : \"fiery.png\",</code>. Finally, on the next line, tell the computer to use a different enemy sprite. Your finished code should look like this:<br /><pre><code>var sprites = {\n\  tile : \"fiery.png\",\n  enemy : \"goonGreen.png\"\n}</code>"
            }
          ],
          "type": "instructions"
        }
      ]
    },
    {
      "title": "Objects are like dictionaries for your data",
      "intro": "Tired of typing <code>var</code> already? The <b>object</b> data type lets you group related bits of data into a single variable and look them up by name, kind of like a dictionary.",
      "sections": [
        {
          "text": "Before moving on to look at other sprites you can use to customize your world, let's break down this last chunk of code a bit more so that you understand the <b>object</b> data type better. Here's the code you just encountered again:\n" + 
`<pre><code>var sprites = {
  tile : "plasma.png",
  enemy : "goonGreen.png"
}</code></pre>
<br />
`         + "Now, observe some things about it..."
          ,
          "type": "paragraph"
        },   
        {
          "observations": [ 
            {
              "observation": "First, notice that the first line uses the familiar <code>var</code> keyword to begin a variable declaration, followed by the variable name <code>>sprites</code>, and finally by the assignment operator, <code>=</code>.",
              "explanation": "So far, nothing is different about using <b>object</b> data types."
            },
            {
              "observation": "Now notice that instead of double-quotes, digits, or special words like <code>true</code> or <code>false</code>, we use a <b>left curly brace</b>, <code>{</code>. This is also known as an <b>open curly brace</b>.",
              "explanation": "When the JavaScript engine encounters the sequence of characters <code>variable = {</code>, it recognizes that you are starting to create a new instance of an <b>object</b> variable."
            },
            {
              "observation": "The next line, <code>tile : \"fiery.png\",</code> places a <b>property</b> named <code>tile</code> inside this new object and assigns the value <code>\"fiery.png\"</code> to it. It follows this with a comma, <code>,</code>, which tells JavaScript to expect another property. Thus, the next line adds another property, <code>enemy</code>, with the value of <code>\"greenGoon.png\"</code>.",
              "explanation": "Here are several things to understand about these lines:" + 
`
<ul>
  <li>You can think of each property within an <b>object</b> like a definition within a dictionary. Instead of keeping the definitions of words in a spoken language, <b>object</b> variables keep definitions of data for your programs.</li>
  <li>The rules for property names are the same as they are for normal variables, unless you surround them with double-quotes, in which case you can put anything you want between the double-quotes. Thus, an example of an invalid property name is: <code>var obj = { 1stPlace: "Me!" }</code>, but <code>var obj = { "1stPlace": "Me!" }</code> is valid!</li>
<li>The colon character, <code>:</code>, functions similarly to the assignment operator, <code>=</code>, that you use when assigning values into variables."</li>
</ul>`              
            },
            {
              "observation": "Finally, because we're only adding two properties to this object, we do not add an additional <code>,</code> character after <code>enemy : \"greenGoone.png\"</code>, and we close the object with a <b>right curly brace</b>, <code>}</code>, which is sometimes called a <b>close curly brace</b>.",
              "explanation": "Wondering whether an object property can point to another object? It can! Here's an example:<br />" + 
`<pre><code>var game = {
  name : "Super Mario Brothers",
  players : {
    mario : {
      lives : 3,
      color : "red"
    },
    luigi : {
      lives: 3,
      color: "green"
    }
  }
}
</code></pre>`
            },
            {
              "observation": "Note also that you will soon see that <code>{</code> and <code>}</code> gets used for lots of other reasons than just creating <b>object</b> instances. It may seem confusing at first, but it will make sense as you see more and more code."
            }
          ],
          "type": "observations"
        },
        {
          "text": "There are a lot of other choices than just <code>\"fiery.png\"</code> <img src='/images/spriteParts/tile/fiery.png' alt='fiery.png'/> and <code>\"plasma.png\"</code> <img src='/images/spriteParts/tile/plasma.png' alt='plasma.png'/> for the <code>tile</code> property, and for the <code>enemy</code> property there are more choices than <code>\"brainBlue.png\"</code> <img src='/images/spriteParts/enemy/brainBlue.png' alt='brainBlue.png'/> and <code>\"goonGreen.png\"</code> <img src='/images/spriteParts/enemy/goonGreen.png' alt='goonGreen'/>. To see the rest, keep going!",   
          "type": "paragraph"
        }
      ]
    },
    {
      "title": "More sprite choices!",
      "intro": "You're probably already thinking about creating your own sprites. Don't worry, in a future lesson you will learn to use graphics editors to make your own sprites. For now, pick your favorites from those below and plug them into the <code>sprites</code> variable as properties to customize your world.",
      "sections": [
        {
          "text": `No new code has been added in this step. That's your job this time. But, here's a sample of what the <code>sprites</code> variable would look like if all the possible properties had their original values: <pre><code>var sprites = {
  tile : "plasma.png",
  enemy : "brainBlue.png",
  coin : "blue.png",
  gem : "pinkGem.png",
  player : "dark.png"
};</code></pre>
<p>The complete sprite choices are in the menu below:</p>
<div class='spriteChoices'></div>`,
          "type": "paragraph",
          "onload": {
            "data": 
`<div class='container-fluid'>
  <div class='row'>
    {{#each this}}
    <div class='col-xs-12 col-sm-6 col-md-4 col-lg-6' style='text-align:center; border: 1px solid lightgray;'>
      <h4><span class='label label-warning'>{{part}}</span></h4>
      <div class='container-fluid'>
        <div class='row'>
          {{#each choices}}
          <div class='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
            <img src='/images/spriteParts/{{this}}' />
            <p>
              <span class='bg-primary' style='padding: 3px; font-size: 80%'>"{{spriteFile this}}"</span>
            </p>
          </div>        
        {{/each}}
        </div>
      </div>
    </div>
    {{/each}}
  </div>
</div>`,
            "script": 
`
(function(templateText) {
  function renderSpriteChoices(sprites) {
    var container;
    var template = Handlebars.compile(templateText);
    var output = template(sprites);
    $('.spriteChoices').html(output);
  }
  $.get('/collectionapi/spriteParts', function(data) {
    data = _.reject(data, function(item) { return item.part === 'Shots'});
    data.forEach(function(item) {
      if (item.part === 'Treasure') item.part = 'Gem';
    });
    renderSpriteChoices(data);
  }).fail(function(err) {
    console.log(err);
  });
})
`
          }
        },
        {
          "instructions": [
            {
              "step": "Modify the object's property values by typing in the values for the sprite images that you like best.",
              "tips": "The sprite images only work for one category. That is, while you can specify <code>enemy: \"goonGreen.png\"</code>, you cannot specify <code>tile: \"goonGreen.png\"</code> or <code>gem: \"goonGreen.png\"</code>."
            }
          ],
          "type": "instructions"
        }
      ]
    },     
    {
      "title": "Array let you group values together in a specific order",
      "intro": "Your world map looks like everyone else's. Let's change that by introducing the concept of Arrays!",
      "sections": [
        {
          "text": "Building new worlds is no fun if the map looks identical, even if the sprite images are slightly different. To customize the actual layout of the world, you will learn about Arrays. Arrays are a staple of almost all programming languages that let you group values together in a specific order. You can add an remove items to Arrays in JavaScript dynamically as well, a feature that's slightly harder in some other languages."         
        },
        {
          "instructions": [
            {
              "step": "On a new line below all the other code you've typed into the <b>Code Editor</b>, type exactly the following code and then press the <b>Update world</b> button to see the changes.<br/><br/>" +              
`<pre><code>var world = ["g", "g", "g", "g"];</code></pre>`      
            },
            {
              "step": "Now, modify that line of code to look like below and update again:<br/><br/>" +              
`<pre><code>var world = [
  ["g", "g", "c", "g"],
  ["g", "g", "c", "g"],
  ["g", "g", "c", "g"],
  ["g", "g", "c", "g"]
];</code></pre>`              
            },
            {
              "step": "What do you think is going on there? What do you notice?"
            },
            {
              "step": "Now, remove the <code>var world = ...</code> entirely and replace it with this code:<br/><br/>" +              
`<pre><code>var worldRows = [
  "ggcgcg",
  "ggcgcg",
  "ggcgcg",
  "ggcgcg"
];</code></pre>`                          
            },
            {
              "step": "Getting the hang of it? Replace the <code>var worldRows =...</code> code with this now:<br/><br/>" +
`<pre><code>var worldRows = [
'cegccccccccccccgcc',
'ctttttcccccctttttc',
'ctgccccccccccccgtc',
'ctttttcccccctttttc',
'ccccctccttcctccccc',
'cctcctccttcctcctcc',
'ccccctcccccctccccc',
'ctcccccccccccccctc',
'ctcttcttttttcttctc',
'ccgccccccpcccccgcc',
'ctcttctcttctcttctc',
'ccgccccccccccccgcc'
];</code></pre>`
            }
          ],
          "type": "instructions"
        },
        {
          "observations": [ 
            {
              "observation": "You tell us! What have you observed here? Discuss with your classmates and your instructors."
            }
          ],
          "type": "observations"
        }
      ]
    }, 
    {
      "title": "Here is a complete world's code for you to customize!",
      "intro": "The world code below contains all the default values and settings. You can change them up to customize it!",
      "sections": [
        {
          "text": "Study the code you see below, and then start to customize it by following the <b>TRY</b> section instructions." ,
          "type": "paragraph"
        },
        {
          "instructions": [
            {
              "step": "Select all the code you see just below and then copy and paste it into the <b>Code Editor</b> on the right side of the screen. Press the <b>Update world</b> button to see the changes.<br/><br/>" +              

`<pre><code>var worldName = "insert name here";

var explorerName = "insert name here";

var numberOfLives = 2;

var enableEnemyRespawn = true;

var worldRows = [
'cegccccccccccccgcc',
'ctttttcccccctttttc',
'ctgccccccccccccgtc',
'ctttttcccccctttttc',
'ccccctccttcctccccc',
'cctcctccttcctcctcc',
'ccccctcccccctccccc',
'ctcccccccccccccctc',
'ctcttcttttttcttctc',
'ccgccccccpcccccgcc',
'ctcttctcttctcttctc',
'ccgccccccccccccgcc'
];

var sprites = {
  tile : "plasma.png",
  enemy : "brainBlue.png",
  coin : "blue.png",
  gem : "pinkGem.png",
  player : "dark.png"
};
</code></pre>`
            }
          ],
          "type": "instructions"                      
        }
      ]
    }    
  ]
};
