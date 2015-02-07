# SpaceMiner Backlog

SpaceMiner takes beginning programmers on an intergalactic journey

# Roles

* `User` -- The most generic, almost useless, category of an actor interacting with SpaceMiner. Generally, avoid using **"As a User"** in stories.
* `Visitor` -- Any User, whether authenticated or not, who is interacting with SpaceMiner.
* `Member` -- A User who has Registered with SpaceMiner and is actively logged in.
* `Admin` -- The User who rules over all and can do anything. The Admin is not quite omnipotent, but aspires to be. 

# Definitions

* `World` -- Members create a World for other Members to explore to collect Gems and Coins (maybe these should actually be minerals or something instead of coins?) for points while fighting off enemies. There will be more to the storyline in later drafts :)
* `Creator` -- Refers to the Member who has created a given World. Members can create as many Worlds as they want.
 
# Stories

We are high-tech in our agile tools here at SpaceMiner in how we track our stories. We use that fancy tracking tool called a Markdown document.

## Key

Unless otherwise prefixed by one of the labels below, consider each bullet point a Story. Indented items are generally less important than their parent, and can be considered "sub stories", unless otherwise noted as `AT`, `D`, or `T`.

* `S` -- A User Story, which should be phrased in terms of a Role type above (almost never `As a User...`)
* `AT` -- Acceptance test
* `D` -- Defect
* `T` -- Task

### Home

* As a Visitor, I can see the most recently Released, Test-Ready, and Under-Development Worlds
	* AT I can see the total number of worlds in each category
	* I see up to one page-full of worlds in each category (probably about 25 or so)
		* When I scroll down, the site pulls in the next 25 worlds under my cursor or finger swipe

* As a Visitor, I can play Released and Test-Ready Worlds
	* AT I can see my point total updating as I play
	* AT I can see my ammo count increase or decrease as I play
	* AT I can see my lives remaining increase or decrease as I play
	* AT I can see the World's Creator's name
		* S I can reveal summary info about the World's Creator 
		* S I can open a new view with detail info about the World's Creator
	* As a Member:
		* S At any time, I can rate the level on a scale of 1 to 5 stars
		* S I can report a bug to the World's Creator

* As a Visitor, I can filter Release and Test-Ready Worlds by:
	* Highest rating by starred points from players
  	* Most difficult to beat (by duration of average time to beat combined with number of tries it takes an idividual to beat it)
	* As a Member:  	
		* Never played before
		* Have played before
  		* By those made by people on my friends list
  		* Made by others who have played worlds I made in the past

* As a Visitor I can Register using my account from:
	* Meetup.com
	* GitHub.com
	* Facebook
	* Google
	* Microsoft
	* Or my own email address
		* AT: When I register, I get an email confirmation of my registration

# Profile

TODO

* Members can view their own profile
* Members can view other Member profiles

# Training (Lessons)

This is where Members learn how to program in order to create their worlds

TODO

# Build (Maybe this shoudl be Teraform?)

This is where Members create Worlds

# Mission Control

This is where information about what's happening across the galaxy shows up

* Training stats in real time
* World information
* Scoreboard that tallies number of gems and coins 


