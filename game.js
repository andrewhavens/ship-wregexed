$(function(){
	$('button.begin').on('click', function(){
		begin();
	});
	$('form').submit(function(e){
		e.preventDefault();
		guess();
	});
});

var current_task = -1;
var solved = false;
var tasks = [
	{
		nodes: '<span class="good">Good</span> <span class="bad">Bad</span>',
		text: 'Good Bad',
		time_limit: 7000,
		answer: ['Good']
	},
	{
		nodes: '<span class="good">good</span> <span class="bad">Good</span>',
		text: 'good Good',
		time_limit: 7000,
		answer: ['good']
	}
];
var running = true;

function begin(){
	current_task = -1;
	$('.message').fadeOut();
	$('#input').fadeIn(function(){
		display_next_task();
	});
}

function display_next_task(){
	setup_next_task();
	var task = tasks[current_task]
	var $html = create_task_html(task);
	$html.appendTo('#game').animate({top: '100%'}, task.time_limit, 'linear', function(){
		$html.remove();
		if (solved) {
			if (current_task == tasks.length - 1) {
				game_won();
			} else {
				display_next_task();
			}
		} else {
			game_lost();
		}
  	});
}

function setup_next_task(){
	current_task++;
	solved = false;
	$('#status').children().hide();
	$('#input').attr('disabled', false);
}

function create_task_html(task){
	return $('<div class="task">' + task.nodes + '</div>');
}

function guess(){
	var task = tasks[current_task]
	var regex = new RegExp($('#input').val());
	var guess = regex.exec(task.text);
	var answer = task.answer
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
			$('.task .good').animate({
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
	show_message($('#game_lost'));
}

function show_message(message){
	$('#input').fadeOut();
	$('#status').fadeOut();
	message.fadeIn();
}
