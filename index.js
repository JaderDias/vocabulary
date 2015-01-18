var words = [];
var numerator = 1;
var denominator = 2;
var record = {};
var yes_answers = 0;
var round = 0;
var min_rounds = 20;
var language = 'English';
var language_code = 'eng';
var min_answers = 15;
var last_round;
var answer_in = min_answers;
var index;

function show_vocabulary_size() {
        if(round == answer_in) {
                answer_in = -1 + ( (answer_in + 1) * 2 );
                last_round = Math.floor(yes_answers * words.length / round);
        }

        var remaining = '.<br/>A better estimate can be given after you answer</small> '
                + ( answer_in - round ) +
                ' <small> more questions.<br/>The estimate is based on a dictionary of the 50,000 most common words in books written in</small> '
                + language +
                ' <small>published since 1980.</small>';

        if(round < min_answers) {
                $("#result").html(
                        '<small>You know </small>'
                        + yes_answers +
                        '<small> out of </small>'
                        + round +
                        '<small> presented words'
                        + remaining
                );
                return;
        }

        var result = last_round * 5;
        $("#result").html(
                '<small>After</small> '
                + round +
                ' <small>answers, it seems that you know about</small> <span id="score">'
                + result +
                '</span> <small>words in</small> '
                + language +
                '<small>'
                + remaining
                + "<br/><a href='https://www.facebook.com/dialog/feed?"
                + "app_id=879219325475623"
                + "&display=popup"
                + "&caption=I%20know%20" + result + "%20words%20in%20" + language
                + "&link=https%3A%2F%2Fjaderdias.github.io%2Fvocabulary%2F"
                + "&redirect_uri=https%3A%2F%2Fjaderdias.github.io%2Fvocabulary%2F'>Share on Facebook</a>"
        );
}

function get_next_word(answer) {
        if(index) {
                record[index.toString()] = answer;
                round++;
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
        var lang = GetURLParameter('lang');
        if(lang == 'spa') {
                language_code = lang;
                language = 'Spanish';
        }

        if(lang == 'fre') {
                language_code = lang;
                language = 'French';
        }

        $("#yes").click(function(){
                yes_answers++;
                get_next_word('yes');
        });
        $("#no").click(function(){
                get_next_word('no');
        });
        $.get(language_code + '.sample.csv', function(result){
                words = result.split("\n");
                get_next_word();
        });
});

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}
