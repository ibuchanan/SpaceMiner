trainingMission = 
{
  "project": "Create your own world!",
  "steps": [
    {
      "title": "Naming your creation",
      "intro": "Have you noticed that planets, moons, and other astronomical phenomena, like craters and asteroids, are named after ancient gods or the human beings who discovered them? Jupiter, Mars, and Bond come to mind. Why should your creation be any different? Feel free to name your world anything you'd like.",
      "sections": [
        {
          "text": "Congratulations, you're ready to create a new world for miners to explore! Follow these steps to give your new world a name:",
          "type": "paragraph"
        },
        {
          "instructions": [
            {
              "step": "Replace the words <code>Space Miner</code> in the Code Editor with a name of your own choosing.",
              "tips": "Be careful to leave both of the double-quote characters, <code>\"</code> and <code>\"</code>, surrounding your new world's name."
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
    }
  ]
};





/*
{
  "title": "World",
  "type": "object",
  "properties": {
    "worldName": {
      "type": "string",
      "title": "World name",
      "description": "Your world's name",
      "minLength": 3,
      "maxLength": 25,
      "default": "Space Miner"
    },
    "explorerName": {
      "type": "string",
      "title": "Explorer name",
      "description": "Claim yourself as this world's explorer!",
      "default": "Ninja Coder",
      "minLength": 2,
      "maxLength": 50
    },
    "numberOfLives": {
      "type": "integer",
      "title": "Number of lives",
      "description": "Specifies the number of times miners can come back to life after enemies destroy them",
      "default": 1,
      "minimum": 1, 
      "maximum": 10
    },
    "enemy": {
      "type": "object",
      "title": "Enemy settings",
      "format": "grid",
      "properties": {
        "speedInitial": {
          "type": "integer",
          "title": "Initial speed",
          "description": "The speed that enemies will move around when the world starts or resets",
          "default": 50,
          "minimum": 25,
          "maximum": 500
        },        
        "respawn": {
          "type": "boolean",      
          "title": "Enemies respawn?",
          "description": "When true, enemies will come back to life after you shoot them",
          "default": true          
        },
        "speedIncreaseBy": {
          "type": "integer",
          "title": "Speed to add after respawning",
          "default": 0,          
          "description": "Specify how much additional speed the enemy will have each time it respawns after getting destroyed",
          "minimum": 0,
          "maximum": 100
        }
      }
    },
    "collisions": {
      "type": "object",
      "title": "Collision settings",
      "description": "Specify what happens when collisions happen in your world",
      "properties": {
        "coin": {
          "type": "object",
          "title": "Coin",
          "description": "Specify what happens when you bump into coins",
          "format": "grid",
          "properties": {
            "scoreInc": {
              "type": "integer",
              "title": "Points to add",
              "description": "Between 5 and 500",
              "default": 50,
              "minimum": 5,
              "maximum": 500
            },
            "soundPlay": {
              "type": "string",
              "title": "Sound to play"
            }
          }
        },
        "gem": {
          "type": "object",
          "title": "Gem",
          "description": "Specify what happens when you bump into gems",          
          "format": "grid",          
          "properties": {
            "scoreInc": {
              "type": "integer",
              "title": "Ammo to add",
              "description": "Between 1 and 8",
              "default": 1,
              "minimum": 1,
              "maximum": 8              
            },
            "soundPlay": {
              "type": "string"
            }
          }
        }
      }
    },
    "favorite_color": {
      "type": "string",
      "format": "color",
      "title": "favorite color",
      "default": "#ffa500"
    },
    "gender": {
      "type": "string",
      "enum": [
        "male",
        "female"
      ]
    },
    "location": {
      "type": "object",
      "title": "Location",
      "properties": {
        "city": {
          "type": "string",
          "default": "San Francisco"
        },
        "state": {
          "type": "string",
          "default": "CA"
        },
        "citystate": {
          "type": "string",
          "description": "This is generated automatically from the previous two fields",
          "template": "{{city}}, {{state}}",
          "watch": {
            "city": "location.city",
            "state": "location.state"
          }
        }
      }
    },
    "pets": {
      "type": "array",
      "format": "table",
      "title": "Pets",
      "uniqueItems": true,
      "items": {
        "type": "object",
        "title": "Pet",
        "properties": {
          "type": {
            "type": "string",
            "enum": [
              "cat",
              "dog",
              "bird",
              "reptile",
              "other"
            ],
            "default": "dog"
          },
          "name": {
            "type": "string"
          }
        }
      },
      "default": [
        {
          "type": "dog",
          "name": "Walter"
        }
      ]
    }
  }
}

*/