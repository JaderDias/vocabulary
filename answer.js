var words = [];
var size = 0;
var index = 0;
var score = 0;
function finish() {
        $("#finished").show();
}
$(function(){
        $("#finished").hide();
        $("#yes").click(function(){
                score += size;
                $('#score').text(score);
                size = Math.floor(size / 2);
                if(size >= 1) {
                        index += size;
                        $("#word").text(words[index]);
                } else {
                        finish();
                }
        });
        $("#no").click(function(){
                size = Math.floor(size / 2);
                if(size >= 1) {
                        index += size;
                        $("#word").text(words[index]);
                } else {
                        finish();
                }
        });
        $.getJSON('dictionary.json', function(result){
                words = result;
                size = Math.floor(words.length / 2);
                index = size;
                $("#word").text(words[index]);
        });
});
