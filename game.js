$(function(){
	$('button.begin').on('click', function(){
		begin();
	});
	$('form').submit(function(e){
		e.preventDefault();
		guess();
	});
});

var current_challenge = -1;
var solved = false;
var running = true;

function begin(){
	current_challenge = -1;
	$('.message').fadeOut();
	$('#input').fadeIn(function(){
		display_next_challenge();
	});
}

function display_next_challenge(){
	setup_next_challenge();
	var challenge = challenges[current_challenge]
	var $html = create_challenge_html(challenge);
	$html.appendTo('#game').animate({top: '100%'}, challenge.time_limit, 'linear', function(){
		$html.remove();
		if (solved) {
			if (current_challenge == challenges.length - 1) {
				game_won();
			} else {
				display_next_challenge();
			}
		} else {
			game_lost();
		}
  	});
}

function setup_next_challenge(){
	current_challenge++;
	solved = false;
	$('#status').children().hide();
	$('#input').attr('disabled', false);
}

function create_challenge_html(challenge){
	return $('<div class="challenge">' + challenge.nodes + '</div>');
}

function guess(){
	var challenge = challenges[current_challenge]
	var regex = new RegExp($('#input').val());
	var guess = regex.exec(challenge.text);
	var answer = challenge.answer
	if (guess && guess.length == answer.length) {
		var correct = true;
		for (var i = 0; i < guess.length; i++) {
			if (guess[i] != answer[i]) {
				correct = false;
				break;
			}
		}
		if (correct) {
			solved = true;
			$('#status .bad').hide();
			$('#status .good').show();
			$('#input').val('').attr('disabled', true);
			$('.challenge .good').animate({
				opacity: 0,
				top: '-100px'
			}, 500);
			return;
		}
	}
	$('#status .bad').show();
};

function game_won(){
	show_message($('#game_won'));
}

function game_lost(){
	$('#game_lost .hint').html(challenges[current_challenge].hint);
	show_message($('#game_lost'));
}

function show_message(message){
	$('#input').fadeOut();
	$('#status').fadeOut();
	message.fadeIn();
}
