var data = {};
var cur_data;

function show_vocabulary_size() {
	var html = '';
	if ( cur_data.nr_questions ) {
		if(cur_data.nr_questions == cur_data.answer_in) {
			cur_data.answer_in = -1 + ( (cur_data.answer_in + 1) * 2 );
			cur_data.score = Math.floor(5 * cur_data.yes_answers * cur_data.words.length / cur_data.nr_questions);
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
				'<small>After</small> '
				+ cur_data.nr_questions +
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
        if(cur_data.index) {
                cur_data.record[cur_data.index.toString()] = answer;
        }

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
        var lang = GetURLParameter('lang') || 'eng';
	$("#lang").val(lang);

        $("#fb-share").click(function(){
                FB.ui({
                  caption: "It's estimated I know " + cur_data.score + " words in " + cur_data.language + " based on " + cur_data.nr_questions + " answers I gave. Click on the link to know the size of your vocabulary.",
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
	loadDictionary(0, lang);
	$("select").change(loadDictionary);
});

function loadDictionary (event, language_code) {
	language_code = language_code || $("#lang").val();
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
		numerator : 1,
		record : {},
		score : 0,
		yes_answers : 0,
	};
	data[language_code] = cur_data;
        $.get(language_code + '.sample.csv', function(result){
                cur_data.words = result.split("\n");
                get_next_word();
        });
}

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
