---
id: mission2
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

${env.embedChat()}
