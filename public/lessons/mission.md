---
id: mission
author: Josh Gough
topics:
 - chat rooms
 - apps 
 - markup
 - style
 - data
 - motion
sub-topics:
 - templates
 - HTML
 - CSS
 - JSON
 - expressions
---

# Your Mission: Save the Galaxy

Send an SOS from deep space, using the basics of programming language expressions.

# Lost in the cosmos

On July 20th, 2269 humanity received a distant cry for help. You are the one who heard the message. How will you answer?

## A cry for help from beyond

Late at night on July 20th, 2269, exactly 300 years from the date that
human beings landed on the Moon, you are sitting comfortably in your office on
the Moon, within the <a href='http://www.haydenplanetarium.org/tyson/'
target='_blank'>Neil deGrasse Tyson Lunar Station</a>. You're reviewing the
messages collected by the <a href='/intergalactiChat'
target='_blank'>IntergalactiChat</a> app you had recently built. After
building the app you shared the link with humans living on Mars, the Moon,
Earth, and other distant locations. They started sharing humorous messages and
the occassional request for help in your chat room app.

It was just another ordinary night until you saw the following message pop up:

<ul class='list-group'><li class='list-group-item'><span class="label label-
warning">Unknown</span> Help us, Earthlings! <small class='text-muted'>sent
10,000 years ago</small></li> </ul>

You are amused that the system reports the message as having been sent 10,000 years ago. Messages from Mars, depending on how far away it is at the time, usually take between 3 and 22 minutes. Even messages near <a href='http://www.pbs.org/seeinginthedark/astronomy-topics/light-as-a-cosmic-time-machine.html' target='_blank'>Jupiter take an average of just 43 minutes to reach the Moon and Earth</a>!

You think it must be a trick played by a near-earth astronaut, and decide to send a reply.

## Chat across the galaxy

When you built <a href='/intergalactiChat' target='_blank'>IntergalactiChat</a>, you made it easy for users to send messages to each other or to everyone all at once, like any <a href='https://en.wikipedia.org/wiki/Chat_room' target='_blank'>classic chat room since the late 1900s</a> has allowed. You also made it easy for others to communicate with the chat room from their spacecraft consoles, spacesuits, touch-screen devices, and many other devices. You made it so that any time they wanted to send a message, they could include a message box and a button like below:

${messageInput()}

<article class='well well-sm'><small>Computers, phones, tablets, and other devices like cars, boats, jets, and, especially, spacecraft, that run programs and scripts may be powerful, but by themselves they don't know what their designers want them to do. Even the most powerful computers in the world still need <b>input</b> from
intelligent human beings or other computers that have been pre-programmed
before they do or produce anything useful.</small></article>

## Add the chat message app to your profile

Being your <b>own first customer</b> is always a wise idea, so you decide to embed the message app into your profile. Here's the code to do it. You may customize the properties and styles however you want. Just make sure to hit the Save Changes button after you have preveiwed the changes you've made. This will save the app into your profile so that your peers can send messages to you.

${env.chatExample()}

## Add data to your profile

You added the ability for your users to show custom data about themselves, like their home planet or station, favorite sport, favorite foods, and more, using simple HTML, CSS, and JSON data, which has been popular since the early 2000s.

Try adding your own data to your profile now. You can start on the <b>Data</b> tab first just to modify the information, then try to modify the code in the <b>Template</b> and <b>Style</b> tabs if you want extra customization:

${env.dataExample()}

# Moving around on distant worlds

Learn how to control your ship, weapons, and defenses with code.

## Move your ship

Your mission will soon be to explore distant worlds and to program robotic explorers to avoid enemies and collect materials to power the galactic defense. To do this, you need to practice the basics of programming your ship to operate on auto-pilot.

Here's how you can control the player ship with code:

${env.moveDirections}

Try now to move the ship with code around this simple world:

${env.training('motion')}

## Navigate challenging spaces

Try now to move your ship, with code, around another world.

Here are the directions again for your reference:

${env.moveDirections}

${env.training('maze')}

## Enemies beware

Now that you have some basic moves down, write the code to maneuver your ship to the left, turn upward, then fire to destroy the enemy.${dbr}

Here are the directions again for your reference:

${env.moveDirections}

${env.training('easyTarget')}

# Sharpen your coding tools

Practice some coding fundamentals that you'll need to craft your automated explorations.

## Hello, Universe: A tiny, complete program
        
Here's a very brief computer program written in the <b>JavaScript</b> programming language. JavaScript has, since its introduction in the Netscape web browser in 1996, become one of the most popular programming languages in the world. JavaScript is built-in to all web modern web browsers that run on desktops, laptops, phones, and tablet devices:

Study this code for a moment before continuing. What do you think it's going to do?

<pre><code>message("Hello, Universe!")</code></pre>

## Executing a tiny program

Here's the same program again. Do you have an hypothesis about what it will do yet? You don't have to know exactly what it will do, just a rough idea. Once you've thought of something, test your hypothesis by pressing the <b>Execute</b> button to run it:

${program('message', 'message("Hello, Universe!")')}

## Evaluate your hypothesis

What did the program do? How did its actual behavior compared to what you expected it to do?`],
       
## Another tiny program

Here's another brief program. Study this one and form another hypothesis about what this one will do before pressing the continue button.

<pre><code>message(1 + 1)</code></pre>

## Execute the program

Once again, here's the program you just saw. Once you have your hypothesis about what it's going to do, press the <b>Execute</b> button to test your hypothesis:

${program('add', 'message(1 + 1)', true)}

## Evaluate your hypothesis

What did the program do this time? How did it compare to what you expected?`],

## Review

In the first program, the program sent the text <b>Hello, Universe!</b> to the <b>IntergalactiChat</b> app. In the second example, the program first performed a simple <b>addition operation</b> and then sent the resulting number <b>2</b> to the <a href='/intergalactiChat' target='_blank'>IntergalactiChat</a> chat room. In both of these examples, <code>message</code> is a <b>function</b>.

A <b>function</b> is a reusable peice of code that you can <b>pass values</b>, known as arguments (sometimes called parameters), into and have it carry out some work for you or transform the values you sent it into a different value. The <b>message</b> function simply takes whatever argument value you send it and then sends it into outerspace for <a href='/intergalactiChat' target='_blank'>IntergalactiChat</a> to display for everyone to see. Handy, right?

Functions are an important topic, but many programs can be even simpler than this. In fact, <code>"Hello, world!"</code>, even without the surrounding <code>message()</code> function is a program all by itself. So is <code>1 + 1</code>. Keep reading to see many more tiny programs.

# Programs start tiny

Just like some complete sentences are only one or a few words, so too can complete programs be very small, and studying small programs helps you learn how to build bigger ones!'

## Short math expressions as programs

Here are several more small programs. Look at each one and try to form an hypothesis about what it will do before you execute it. Don't worry if some of them are difficult. You will learn all about these soon enough!

<i>Try these one by one first as explained above, but you can come back later and execute or reset all of them at once with these buttons:</i> 

${sampleProgramExecAll()}

${env.tinyPrograms1()}

## Modulus magic

You've just executed lots and lots of programs! As you probably learned, all of them involved numbers and basic mathematical operations that you probably know already. But, what was happening with that <code>%</code> one that you had to execute so many times? What does that do?

## Number comparison programs

Here are a bunch of other small programs for you to execute:

${env.tinyPrograms2()}

## Equality and inequality programs

You are doing great, so let's try some more small programs. Think about what each of the following might produce and then try them to test your hypotheses:

${env.equalityAndInequalityPrograms()}

## String functions preview

Now, we're going to get into more complex code. Don't worry if these don't make sense at first. Just try to get the hang of it.

${env.stringPrograms()}

