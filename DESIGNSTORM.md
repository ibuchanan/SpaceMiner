# 4/11/2015

At this point there are two main aspects to what we're using SpaceMiner for:

* Learning App: A tool to help students, mentors, teachers, and parents or other interested people learn a new subject collaboratively. The tool employs powerful real-time features to aid this process.
* A Programming with JavaScript Curriculum: A set of cumulative lessons about programming and the JavaScript language specifically, with the SpaceMiner framework as the initial context.

Both of these are equally important for the system to advance. We must evolve the tool in response to actual usage with students in classroom situations, and we must improve the lesson content to continue offerring a valued service.

It is challenging to do both of these concurrently. Because of this, we need to specialize in pairs on each aspect for a while to stablize both.

## Vision

* `Consume` -- A Visitor's first experience is to "consume" the game, that is to Play a Game as soon as they load the app.
* `Clone` -- After Consuming, a Visitor can Clone a World, but must Create Account or Login first to be authenticated as a User.
  * To Clone a World, the User must change the world name and select different sprites.
    * A `Customize more` button or `Done` button allows them to change more properties of the world, starting with the World Map
  * Results: 
    * Cloned world visible in User Profile under My Worlds
      * Each world shows a Customize button, which renders the JSON-editor based customization UI, which should also feature an "advanced" view that has the generated JSON definition of the world.
        * NOTE: this will get tricky when it comes to actual script code, because that is going to have to be a string value. We might have to split the view into the definitional, pure JSON part, and a script part that allows editing the actual script code where appropriate.
    * Cloned world visible in original Author's User Profile under Offspring Worlds or maybe "Mutant Worlds"
* `Create` -- Any time after a User has Cloned one other world, they can Create a World from scratch, which simply starts with the JSON editor based World Editor, without the need to clone an existing level. The World Map should start blank.
  * IDEA: There could be commands for terraforming the world, like building boxes of sprites, or circular groupings, overlaying, skipping, repeating, etc. And, the ship or a similar sprite should animate this process, with the option to do it very quickly or more slowly. This way, when the world loads, it will show this process each time.
* `Collaborate` -- A User can invite other users to participate in the Create World or Customize World editing process. If so, the invited collaborator will get a credit in the world's details.
  * Both, or all, users will see the same world data on their screen and see the changes updating in real time.
    * NOTE: since each world is just a JSON document, we can support UNDO by saving revisions. Initially, we can keep the limit to 10, until we have more data sotrage, like a GitLabs account for each user.
    

## Short term goals for the Learning App



* Incorporate the JSON-Editor based World Creator screen as the first step in Build World, to 
* Review all loosely related functionality within the Build World, Lesson, Challenge, MissionControl, and Dash features
* Consolidate all useful lesson-like functionality into Meteor Components that can, for now, be authored via a JavaScript DSL that produces a JSON Schema-backed document which the Lesson component can render properly.
  * Near term: Enable authoring and editing of Lessons with a JSON-Editor based UI 
