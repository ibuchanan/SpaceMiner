---
id: mining-basics
author: Josh Gough, Daniel Aldrich
topics:
 - starting new worlds
 - drilling mines
 - examples
sub-topics:
 - function calls
 - function arguments
---

# Misson One

You create new worlds in SpaceMiner using JavaScript code. The most basic way involves calling functions built into SpaceMiner to customize how the world gets drawn and how to change the world when different events happen.

# Basic Functions

Learn how to control the powers of your ship with JavaScript functions to get started building and exploring new worlds in this galactic adventure.

## Drilling Mines

Once you discover a new world your first task is to drill a mine by programming your ship to deploy drones into one of its ore rich areas.

These drones transform raw materials into easy to collect and store coins. 
 -Somethign about how ship tps those coins out as currency to justify the score counter
-Gems as fuel source maybe

You do this by creating a program via the code editor installed in your ship. Your editor has three major functionalities: 

-Update & prewview world
	- Creates a simulation blah blah
-Sent world to test
	- Deploy one drone to test code
-Release world
	- Bugs iron'd out of code ready for commercial use 



Here's a simplest example:

${program('', 'start(mine);')}

Another example:

${program('', \`start(
    mine,
    mine(at(2))
);\`)}

