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
* `Explorer` -- Refers to a User who explores Worlds invented by Creators
 
# Story Map

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

* As a Visitor I can view a list of Training Missions (Lessons) which will help me learn how to create a World by learning JavaScript and the SpaceMiner framework
	* S I can see how many Trainees have completed each Training Mission
		* S Based on Trainee answers to tests within a Training Mission, I can see the:
			* AT Mean score
			* AT Median score
			* AT STD DEV of scores
	* As a Member:
		* For each Training Mission I have already attempted, I can see a Completion Badge that indicates how much of the Mission I have already completed
			* AT If I have completed 50%, then the badge should be 50% solid and 50% silhouetted.
			* AT I can see the percentage in text form as well as in the badge form
		 
* As a Visitor I can Open a Training Mission
	* AT When I open a Mission:
		* AT As a Visitor: I begin on the first Step of the Mission
		* AT As a Member: I begin on the Step that I left off on before
			* AT If I have already completed the mission, then I see my Mission Summary for the Training Mission
				* AT And, I can direcrly skip to view a Mission Step 
					* TODO this needs more clarity
		* AT When I'm on a Mission Step I can see that I'm on Step N/M, such as 1/5
		* AT If the Mission Step has questions to answer, then only after I answer the questions can I advance to the next Mission Step
		* AT For Mission Steps after Step 1, I can:
			* AT Return to First Step
			* AT Return to Previous Step
		* AT When I'm on a Step that I have already completed, then:
			* AT I can choose to Reveal my previous Question Answers
			* AT I can choose to Rest my previous Question Answers


# Build (Maybe this shoudl be Teraform?)

This is where Members create Worlds

# Mission Control

This is where information about what's happening across the galaxy shows up

* Training stats in real time
* World information
* Scoreboard that tallies number of gems and coins 


