# SpaceMiner Backlog

SpaceMiner takes beginning programmers on an intergalactic journey

# Roles

* `User` -- The most generic, almost useless, category of an actor interacting with SpaceMiner. Generally, avoid using **"As a User"** in stories.
* `Visitor` -- Any User, whether authenticated or not, who is interacting with SpaceMiner.
* `Member` -- A User who has Registered with SpaceMiner and is actively logged in.
* `Admin` -- The User who rules over all and can do anything. The Admin is not quite omnipotent, but aspires to be. 

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

* As a Visitor, I can filter Release and Test-Ready Worlds by:
	* Highest rating by starred points from players
  	* Most difficult to beat (by duration of average time to beat combined with number of tries it takes an idividual to beat it)
	* As a Registered User:  	
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
