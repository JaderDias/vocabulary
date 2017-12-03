var data = {};
var cur_data;

function show_vocabulary_size() {
	var html = '';
	if ( cur_data.nr_questions ) {
		if(cur_data.nr_questions == cur_data.answer_in) {
			cur_data.answer_in = -1 + ( (cur_data.answer_in + 1) * 2 );
			cur_data.score = Math.floor(5 * cur_data.yes_answers * cur_data.words.length / cur_data.nr_questions);
			cur_data.last_milestone = cur_data.nr_questions;
		}

		var remaining = '.<br/>A better estimate can be given after you answer</small> '
			+ ( cur_data.answer_in - cur_data.nr_questions ) +
			' <small> more questions.<br/>The estimate is based on a dictionary of the 50,000 most common words in books written in</small> '
			+ cur_data.language +
			' <small>published since 1980.</small>';

		if(cur_data.nr_questions < cur_data.min_answers) {
			html =
				'<small>You know </small>'
				+ cur_data.yes_answers +
				'<small> out of </small>'
				+ cur_data.nr_questions +
				'<small> presented words'
				+ remaining;
		}
		else {
			html =
				'<small>Based on</small> '
				+ cur_data.last_milestone +
				' <small>answers, it seems that you know about</small> <span id="score">'
				+ cur_data.score +
				'</span> <small>words in</small> '
				+ cur_data.language +
				'<small>'
				+ remaining;
		}
	}

        $("#result").html(html);
}

function get_next_word(answer) {
	if(answer) {
                cur_data.nr_questions++;
	}

	show_vocabulary_size();

        cur_data.numerator += 2;
        if(cur_data.numerator > cur_data.denominator) {
                cur_data.numerator = 1;
                cur_data.denominator *= 2;
        }

        cur_data.index = Math.round((cur_data.numerator * cur_data.words.length) / cur_data.denominator);
        $("#word").text(cur_data.words[cur_data.index]);
}

$(function(){
        var lang = 'eng';
	if ( document.location.hash ) {
		lang = document.location.hash.substr(1);
	}

	$("#lang").val(lang);

        $("#fb-share").click(function(){
                FB.ui({
                  caption: "It's estimated I know " + cur_data.score + " words in " + cur_data.language + " based on " + cur_data.last_milestone + " answers I gave. Click on the link to know the size of your vocabulary.",
                  method: 'share',
                  href: 'https://jaderdias.github.io/vocabulary/',
                }, function(response){});
        });
        $("#yes").click(function(){
                cur_data.yes_answers++;
                get_next_word('yes');
        });
        $("#no").click(function(){
                get_next_word('no');
        });
	loadDictionary(lang);
	$("select").change(function() {
		language_code = $("#lang").val();
		document.location.hash = language_code;
		loadDictionary(language_code);
	});
});

function loadDictionary (language_code) {
	cur_data = data[language_code];
	if ( cur_data ) {
		$("#word").text(cur_data.words[cur_data.index]);
                get_next_word();
		return;
	}

	cur_data = {
		answer_in : 15,
		denominator : 2,
		index : 0,
		language: $("#lang option:selected").html(),
		min_answers : 15,
		nr_questions : 0,
		last_milestone : 0,
		numerator : 1,
		score : 0,
		yes_answers : 0,
	};
	data[language_code] = cur_data;
        $.get(language_code + '.sample.csv', function(result){
                cur_data.words = result.split("\n");
                get_next_word();
        });
}
