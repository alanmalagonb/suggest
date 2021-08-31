var input = document.querySelector('.emoji-button');
var text = document.querySelector('.text');
var picker = new EmojiButton({
    position: 'right-start'
})

picker.on('emoji', function(emoji) {
    text.value += emoji;
})

input.addEventListener('click', function() {
    picker.pickerVisible ? picker.hidePicker : picker.showPicker(input)
})