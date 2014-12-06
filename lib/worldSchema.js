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