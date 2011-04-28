/**
 *  _   _    _    ____ _  _______ _____ ____ _____ 
 * | | | |  / \  / ___| |/ /  ___| ____/ ___|_   _|
 * | |_| | / _ \| |   | ' /| |_  |  _| \___ \ | |  
 * |  _  |/ ___ \ |___| . \|  _| | |___ ___) || |  
 * |_| |_/_/   \_\____|_|\_\_|   |_____|____/ |_|  
 *
 * QuickLeft Hackfest
 * April 27 2011
 *
 * JavaScript
 * Written by, Nico Valencia
 *
 * @module HACKFEST
 */

(function( window, undefined ){

var HACKFEST = {

	seaDenizenMap: {
		"hipster_octopus": 0,
		"big_squid": 1,
		"star_starfish": 2,
		"drunk_clam": 3
	},

	init: function () {
		$("#message_form").show();
		$("#go").bind("click", function() {
			HACKFEST.go(
				$("#zombie_whale"), 
				$("#" + $("#toSelect").val()), 
				$("#message").val()
			);
		});
	},

	go: function (sender, recipient, message) {
		$("#response").hide();
		$("#message_form").hide();
		sender
			.css({ backgroundPosition: "0 -487px" })
			.animate({
				top: HACKFEST.boundTop(recipient, recipient.position().top),
				left: HACKFEST.boundLeft(recipient, recipient.position().left)
			}, "slow", function() { HACKFEST.arrive(sender, recipient); });
	},

	arrive: function(sender, recipient) { 
		HACKFEST.queryYahooLocal($("#place").val(), $("#query").val(), function(results) {
			$("#response")
				.html(HACKFEST.renderLocal(results ? results[HACKFEST.seaDenizenMap[recipient.attr("id")]] : null))
				.show();
		});

		sender.css({ backgroundPosition: "0 -186px" });
		$("#message_form")
			.css({
				top: HACKFEST.boundTop($("#message_form"), sender.position().top - 200),
				left: HACKFEST.boundLeft($("#message_form"), sender.position().left)
			})
			.show();
		$("#go").unbind().bind("click", function() {
			HACKFEST.go(
				sender, 
				$("#" + $("#toSelect").val()), 
				$("#message").val()
			);
		});
	},

	boundTop: function(el, y) {
		var margin = 10;
		return Math.min(y, $("#ocean").height() - el.height() - margin);
	}
,

	boundLeft: function(el, x) {
		var margin = 75;
		return Math.min(x, $("#ocean").width() - el.width() - margin);
	},

	queryYahooLocal: function(place, query, success) {
		$.ajax({
			url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20local.search%20where%20query%3D%22{query}%22%20and%20location%3D%22{place}%2C%20ca%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys".supplant({query: encodeURI(query), place: encodeURI(place)}),
			dataType: "json",
			success: function(response) {
				success(response.query.results ? response.query.results.Result : null)
			}
		});
	},

	renderLocal: function(localResult) {
		return !localResult ? 
			create(["div", {}, "I don't know any place good there."]) :
			create(["div", {}, "There's {title}. {rating}. {review}".supplant({
				title: localResult.Title, 
				rating: localResult.Rating.AverageRating && !isNaN(localResult.Rating.AverageRating) ? "I'd give it a " + localResult.Rating.AverageRating : "I'm not sure how to rate it.",
				review: localResult.Rating.LastReviewIntro || ""
			})]);
	}

};

$( document ).ready( HACKFEST.init );

})( this );
