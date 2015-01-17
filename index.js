var words = [];
var numerator = 1;
var denominator = 2;
var record = {};
var yes_answers = 0;
var round = 0;
var min_rounds = 20;
var index;
function finish() {
        $("#form").hide();
}

function show_vocabulary_size() {
        var size = Math.floor(yes_answers * words.length / round);
        $("#result").html(
                '<small>we estimate that you know</small> <span id="score">'
                + size +
                '</span> <small>words in</small> English <small>after</small> '
                + round +
                ' <small>answers</small>'
        );
}

function get_next_word(answer) {
        if(index) {
                record[index.toString()] = answer;
                round++;
        }

        if(answer == 'yes') {
                yes_answers++;
        }
        
        if(round >= min_rounds) {
                show_vocabulary_size();
        }

        numerator += 2;
        if(numerator > denominator) {
                numerator = 1;
                denominator *= 2;
        }

        index = Math.round((numerator * words.length) / denominator);
        $("#word").text(words[index]);
}

$(function(){
        $("#yes").click(function(){
                get_next_word('yes');
        });
        $("#no").click(function(){
                get_next_word('no');
        });
        $.getJSON('dictionary.json', function(result){
                words = result;
                get_next_word();
        });
});
