markdownLesson('mission.md', 'mission2', {
	embedChat() {
		return dynamo({
name:'message',
tabs: ['Template', 'Style','Result'],
template: `{{> message title="Comet Chat" author= "Comet, Inc."}}`,
style: `* .message-app {
	background: gray;
	color: white;
	padding: 10px;
	text-align: center;
	border: 10px solid gold; } 
* .message-input {
	background: yellow;
}
* .message-send {
	background: orange;
	text-transform: uppercase
}`,
data: ''});
}});
