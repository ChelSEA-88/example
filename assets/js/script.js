/* -- ||  Contact.html Logo/Icon Image || -- */
/* © Joshua M. Small */

// Change #gallivant-logo-contact from Logo -to-> Icon on window < 768px
function checkResolution() {
	if ($(window).innerWidth() < 768) {
		// window < 640px = Icon
		$("#gallivant-logo-contact").attr(
			"src",
			"assets/images/gallivant-icon.png",
		);
	} else {
		// window > 768px = Logo
		$("#gallivant-logo-contact").attr(
			"src",
			"assets/images/gallivant-logo.png",
		);
	}
}
// Check img on window resize
$(window).resize(function () {
	checkResolution();
});

// Check img on window load
$(document).ready(function () {
	checkResolution();

	/* -- || Form Date Restriction || -- */
	/* © Joshua M. Small */

	// Todays Date
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yy = today.getFullYear();
	if (dd < 10) {
		dd = "0" + dd;
	}
	if (mm < 10) {
		mm = "0" + mm;
	}
	var rightNow = yy + "-" + mm + "-" + dd;
	// Set Todays Date
	$("#departing-date").attr("value", rightNow);
	console.log("Today's Date: ", rightNow);
	// min Departure Date
	$(".form-date").attr("min", rightNow);
	console.log("Min. Departure Date: ", rightNow);
	// Min Return Date
	$("#departing-date").on("change", function () {
		$("#returning-date").attr("min", $(this).val());
	});
	// Max Date (+1 year)
	var dateMax = yy + 1 + "-" + mm + "-" + dd;
	$(".form-date").attr("max", dateMax);
	console.log("Max Date: ", dateMax);

	/* -- || Form (#loc-date-form) || -- */
	/* © Joshua M. Small */

	$("#submit-btn").click(function () {
		(window.location.href = "./results.html"), true;
	});

	/* Captures index.html formData to be used on results.html */
	// Instead of listening to button click, always listen to form submit event
	$("#loc-date-form").submit(function () {
		// Create an array of objects called `formData`
		var formData = $(this)
			.find(":input")
			.map(function () {
				return {
					name: $(this).attr("name"),
					value: $(this).val(),
				};
			})
			.get();

		// Store it in localStorage
		localStorage.setItem("formData", JSON.stringify(formData));
	});

	// Read and parse from localStorage
	var formData = JSON.parse(localStorage.getItem("formData"));

	// Iterate through array, and set HTML of matching <span> element
	$.each(formData, function (i, datum) {
		$("#display_" + datum.name).html(datum.value);
	});
	console.log("formData Array:", formData);

	/* Trip Selection Title Change */
	/* © Joshua M. Small */

	// genSelectTitles() must be before int/rtn-select functions
	function genSelectTitles(formData) {
		// empty any existing content
		$("#trip-selection").empty();

		console.log("Create Trip Selection Titles");

		$("#trip-selection").append(
			"<div id='int-select'><a>" +
				formData[0].value +
				" - to - " +
				formData[2].value +
				"</a></div>",
			"<div id='rtn-select'><a>" +
				formData[2].value +
				" - to - " +
				formData[0].value +
				"</a></div>",
		);
	}

	genSelectTitles(formData);

	/* -- || Trip Container Display || -- */
	/* © Joshua M. Small */

	$("#int-select").click(function () {
		document.getElementById("int-select").style.textShadow =
			"2px 2px 1px black";
		document.getElementById("rtn-select").style.textShadow = "none";
		$("#int-trip-container").show();
		$("#rtn-trip-container").hide();
	});

	$("#rtn-select").click(function () {
		document.getElementById("int-select").style.textShadow = "none";
		document.getElementById("rtn-select").style.textShadow =
			"2px 2px 1px black";
		$("#int-trip-container").hide();
		$("#rtn-trip-container").show();
	});

	/* Trip Titles for Callout */
	/* © Joshua M. Small */

	function getCalloutTitles(formData) {
		$("#city-name-1").append(formData[2].value);
		$("#city-name-1-5-day").append(formData[2].value);
		$("#city-name-2").append(formData[0].value);
	}

	getCalloutTitles(formData);

	/* -- || UnSplash API || -- */

	function searchPicture(formData) {
		$.ajax({
			type: "GET",
			url:
				"https://api.unsplash.com/search/photos/?client_id=" +
				"DlLo3jJvn5zyAKmxFu4A5tczXvAgDss4YSwR1hVVr7U" +
				"&collections=travel,city&orientation=landscape&query=" +
				formData[2].value,
			dataType: "json",
			success: function (data) {
				console.log("Picture Data:", data);

				// empty any existing content
				$(".d-picture-api").empty();

				// Create IMG
				var dImg = $("<img>", {
					id: "d-img-div",
				});
				dImg.attr("src", data.results[0].urls.regular);
				console.log("IMG URL:", data.results[0].urls.regular);

				// Append Info
				$(".d-picture-api").append(dImg);
			},
		});

		$.ajax({
			type: "GET",
			url:
				"https://api.unsplash.com/search/photos/?client_id=" +
				"DlLo3jJvn5zyAKmxFu4A5tczXvAgDss4YSwR1hVVr7U" +
				"&collections=travel,city&orientationlandscape&query=" +
				formData[0].value,
			dataType: "json",
			success: function (data) {
				console.log("Picture Data:", data);

				// empty any existing content
				$(".r-picture-api").empty();

				// Create IMG
				var rImg = $("<img>", {
					id: "r-img-div",
				});
				rImg.attr("src", data.results[0].urls.regular);
				console.log("IMG URL:", data.results[0].urls.regular);

				// Append Info
				$(".r-picture-api").append(rImg);
			},
		});
	}

	searchPicture(formData);

	/* -- || FourSquare POI API || -- */
	/* © Joshua M. Small */

	console.log("-- || FourSquare POI API || --");

	// ES6: Generate HTML structure
	function genAPOIHTML(name, prefix, suffix, category, formattedAddress) {
		var resultsPOI = `<div class="poiContainer" id="rPoiContainer">
				<div class="poiName" id="rPoiName">${name}</div>
				<img src="${prefix}100${suffix}">
				<div class="poiCategory" id="rPoiCategory">${category}</div>
				<div class="poiAddress" id="rPoiAddress">${formattedAddress}</div>
			</div>`;

		return resultsPOI;
	}

	/* Departing Location */
	console.log("Departing City:", formData[0].value);

	function searchPoi1(formData) {
		console.log("-- || Start POI Arrival Function || --");

		$.ajax({
			dataType: "json",
			url:
				"https://api.foursquare.com/v2/venues/explore?client_id=" +
				"QAEJY0NAQYS0IHBYU1NXNCWNBTMMIESQ0URVCHIVYXO2YBEC" +
				"&client_secret=" +
				"SCZW0ZYVTPRLYFA1QXLRISAXCBXUNFURYEMUVGHORJ5NZUQN" +
				"&v=20180323&limit=10&near=" +
				formData[0].value,
			data: {},
			beforeSend: function (jqXHR, settings) {
				console.log("ajax URL:", settings.url);
			},
			success: function (data) {
				console.log("-- || POI Arrival Data || --");
				console.log("Data:", data);

				// empty any existing content
				$(".r-attractions-api").empty();

				// Create POI Title
				var aTitle = $("<div>", {
					class: "poiTitle",
					id: "aPoiTitle",
				});
				aTitle.text(formData[0].value + "'s Attractions:");

				$(".r-attractions-api-title").append(aTitle);

				console.log("-- || POI Arrival Loop || --");
				for (var i = 0; i < 5; i++) {
					console.log(
						"A Loop #",
						i,
						"| Name:",
						data.response.groups[0].items[i].venue.name,
						"| Pic URL:",
						data.response.groups[0].items[i].venue.categories[0].icon.prefix,
						data.response.groups[0].items[i].venue.categories[0].icon.suffix,
						"| Category:",
						data.response.groups[0].items[i].venue.categories[0].name,
						"| Address:",
						data.response.groups[0].items[i].venue.location.formattedAddress,
					);

					// Append Info
					var aContainer = genAPOIHTML(
						data.response.groups[0].items[i].venue.name,
						data.response.groups[0].items[i].venue.categories[0].icon.prefix,
						data.response.groups[0].items[i].venue.categories[0].icon.suffix,
						data.response.groups[0].items[i].venue.categories[0].name,
						data.response.groups[0].items[i].venue.location.formattedAddress,
					);

					// Merge and display
					$(".r-attractions-api").append(aContainer);
				}
			},

			// Code for handling errors
			error: function (jqXHR, textStatus, errorThrown) {
				alert("Result: " + jqXHR + " " + textStatus + " " + errorThrown);
			},
		});
	}

	/* Arriving Location */
	console.log("Arriving City:", formData[2].value);

	function searchPoi2(formData) {
		console.log("-- || Start POI Return Function || --");

		// empty any existing content
		$(".r-attractions-api").empty();

		// Create POI Title
		var dTitle = $("<div>", {
			class: "poiTitle",
			id: "aPoiTitle",
		});
		dTitle.text(formData[2].value + "'s Attractions:");

		$(".d-attractions-api-title").append(dTitle);

		$.ajax({
			dataType: "json",
			url:
				"https://api.foursquare.com/v2/venues/explore?client_id=" +
				"QAEJY0NAQYS0IHBYU1NXNCWNBTMMIESQ0URVCHIVYXO2YBEC" +
				"&client_secret=" +
				"SCZW0ZYVTPRLYFA1QXLRISAXCBXUNFURYEMUVGHORJ5NZUQN" +
				"&v=20180323&limit=10&near=" +
				formData[2].value,
			data: {},
			beforeSend: function (jqXHR, settings) {
				console.log("ajax URL:", settings.url);
			},
			success: function (data) {
				console.log("-- || POI Return Data || --");
				console.log("Data:", data);

				// empty any existing content
				$(".d-attractions-api").empty();

				console.log("-- || POI Return Loop || --");
				for (var i = 0; i < 5; i++) {
					console.log(
						"R Loop #",
						i,
						"| Name:",
						data.response.groups[0].items[i].venue.name,
						"| Pic URL:",
						data.response.groups[0].items[i].venue.categories[0].icon.prefix,
						data.response.groups[0].items[i].venue.categories[0].icon.suffix,
						"| Category:",
						data.response.groups[0].items[i].venue.categories[0].name,
						"| Address:",
						data.response.groups[0].items[i].venue.location.formattedAddress,
					);

					// Append Info
					var rContainer = genAPOIHTML(
						data.response.groups[0].items[i].venue.name,
						data.response.groups[0].items[i].venue.categories[0].icon.prefix,
						data.response.groups[0].items[i].venue.categories[0].icon.suffix,
						data.response.groups[0].items[i].venue.categories[0].name,
						data.response.groups[0].items[i].venue.location.formattedAddress,
					);

					// Merge and display
					$(".d-attractions-api").append(rContainer);
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				// Code for handling errors
				alert("Result: " + jqXHR + " " + textStatus + " " + errorThrown);
			},
		});
	}

	// Call Functions
	searchPoi1(formData);
	searchPoi2(formData);

	/* -- || Skypicker Flight Search || -- */
	/* © Tanner Cook */

	console.log("-- || Skyscanner Flight Search || --");

	function searchFlight() {
		var formData = JSON.parse(localStorage.getItem("formData"));
		var departLoc = formData[0].value;
		var departDate = formData[1].value;
		var arrivalLoc = formData[2].value;
		var arrivalDate = formData[3].value;
		var flightApiCodeDep =
			"https://api.skypicker.com/locations?term=" +
			departLoc +
			"&locale=en-US&location_types=airport&limit=1&active_only=true&sort=name";
		var flightApiCodeArr =
			"https://api.skypicker.com/locations?term=" +
			arrivalLoc +
			"&locale=en-US&location_types=airport&limit=1&active_only=true&sort=name";
		var apiCodeDepart;
		var apiCodeArrival;
		getFlightInfo();

		function getFlightInfo() {
			$.ajax({
				url: flightApiCodeDep,
				dateType: "json",
				method: "GET",
				success: function (codeDData) {
					apiCodeDepart = codeDData.locations[0].code;
					if (apiCodeDepart === null) {
						$(".d-flight-api").append(`<p>Could not be found!?</p>`);
					} else {
						$.ajax({
							url: flightApiCodeArr,
							dateType: "json",
							method: "GET",
							success: function (codeAData) {
								apiCodeArrival = codeAData.locations[0].code;
								// Arrival Date Correct Format
								var arriveRearrange = moment(arrivalDate).format("DD/MM/YYYY");

								// Depature Date Correct Format
								var departRearrange = moment(departDate).format("DD/MM/YYYY");

								if (apiCodeArrival === null) {
									$(".d-flight-api").append(`<p>Could not be found!?</p>`);
								} else {
									// Make Arrival API URL
									var flightApiArrivingAir =
										"https://api.skypicker.com/flights?fly_from=" +
										apiCodeArrival +
										"&fly_to=" +
										apiCodeDepart +
										"&dateFrom=" +
										arriveRearrange +
										"&dateTo=" +
										arriveRearrange +
										"&partner=picky&v=3&limit=5";
									// Make Departure API URL
									var flightApiDepartingAir =
										"https://api.skypicker.com/flights?fly_from=" +
										apiCodeDepart +
										"&fly_to=" +
										apiCodeArrival +
										"&dateFrom=" +
										departRearrange +
										"&dateTo=" +
										departRearrange +
										"&partner=picky&v=3&limit=5";
									// Departing AJAX

									$.ajax({
										url: flightApiDepartingAir,
										dataType: "json",
										method: "GET",
										success: function (data) {
											console.log("dTimeUTC", data);
											for (var i = 0; i < 5; i++) {
												// Time Conversion
												var utcSeconds = data.data[i].dTimeUTC;
												var departTime = new Date(0);
												departTime.setUTCSeconds(utcSeconds);
												var arrivalTime = new Date(0);
												arrivalTime.setUTCSeconds(data.data[i].aTimeUTC);
												if (data.data[i].cityFrom !== formData[0].value) {
													$(".d-flight-api").append(
														"Airport flight information not availble for this location",
													);
												}

												// If Null
												if (apiCodeDepart === null) {
													$(".d-flight-api").append(
														`<p>Could not be found!?</p>`,
													);
												} // Else Works
												else {
													// Append Departure Info
													$(".d-flight-api").append(
														`<h5>From ${data.data[i].cityFrom} to ${data.data[i].cityTo}</h5>`,
													);
													$(".d-flight-api").append(
														`<h6 class="apirport-code">${data.data[i].cityCodeFrom}</h6>`,
													);
													$(".d-flight-api").append(
														`<p class="airport-time">${departTime}</p>`,
													);
													$(".d-flight-api").append(
														`<h6 class="apirport-code">${data.data[i].cityCodeTo}</h6>`,
													);
													$(".d-flight-api").append(
														`<p class="airport-time">${arrivalTime}</p>`,
													);
												}
											}
										},
									});
									// Arrial AJAX
									$.ajax({
										url: flightApiArrivingAir,
										dateType: "json",
										method: "GET",
										success: function (data) {
											for (var i = 0; i < 5; i++) {
												// Time Conversion
												var utcSeconds = data.data[i].dTimeUTC;
												var departTime = new Date(0);
												departTime.setUTCSeconds(utcSeconds);
												var arrivalTime = new Date(0);
												arrivalTime.setUTCSeconds(data.data[i].aTimeUTC);
												if (data.data[i].cityFrom !== formData[2].value) {
													$(".r-flight-api").append(
														"Airport flight information not availble for this location",
													);
												}
												// If Null
												if (apiCodeDepart === null) {
													$(".d-flight-api").append(
														`<p>Could not be found!?</p>`,
													);
												} // Else Works
												else {
													// Append Return Info
													$(".r-flight-api").append(
														`<h5>From ${data.data[i].cityFrom} to ${data.data[i].cityTo}</h5>`,
													);
													$(".r-flight-api").append(
														`<h6 class="apirport-code">${data.data[i].cityCodeFrom}</h6>`,
													);
													$(".r-flight-api").append(
														`<p  class="airport-time">${arrivalTime}</p>`,
													);
													$(".r-flight-api").append(
														`<h6 class="apirport-code">${data.data[i].cityCodeto}</h6>`,
													);
													$(".r-flight-api").append(
														`<p class="airport-time">${departTime}</p>`,
													);
												}
											}
										},
									});
								}
							},
						});
					}
				},
			});
		}
	}
	//need statement to stop displaying flights if given city does not match input city
	//solve route issue

	searchFlight(formData);

	/* -- ||  Open Weather Map || -- */
	/* © Garrett Dobson */

	console.log("-- || Open Weather Map API || --");

	// Global weather variables
	var imperialUnits = "&units=imperial";
	var apiWeatherKey = "&appid=f18b83f11c206025350af3f0978bacde";
	var searchValueDestination = formData[2].value;
	var searchValueDepart = formData[0].value;

	// Initial trip functions
	// forecast
	function genForecastHTML(name, fivedatestr, icon, temp, humidity, speed) {
		var forecastWeather = `<div class="card-forecast bg-light" style="width: 20%;">
					<div class="card-body">
						<h5 class="card-title">${name}</h5>
						<p class="card-text"> ${fivedatestr} </p>
						<img src="https://openweathermap.org/img/w/${icon}.png">
						<p class="card-text">Temperature: ${temp} °F</p>
						<p class="card-text">Humidity: ${humidity} %</p>
						<p class="card-text">Wind Speed: ${speed} MPH</p>

					</div>
				</div>`;

		return forecastWeather;
	}

	//5 day forecast of city you're going to
	function getForecast(searchValueDestination) {
		var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
		$.ajax({
			type: "GET",
			url: forecastURL + searchValueDestination + imperialUnits + apiWeatherKey,
			dataType: "json",
			success: function (data) {
				console.log("forecast works");

				for (var i = 0; i < data.list.length; i++) {
					if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
						console.log(data);

						var fiveSec = data.list[i].dt;
						var fiveForecastDate = new Date(fiveSec * 1000);
						var fiveDateStr = fiveForecastDate.toLocaleDateString();
						console.log(fiveDateStr);

						var fiveDayForecast = genForecastHTML(
							data.city.name,
							fiveDateStr,
							data.list[i].weather[0].icon,
							data.list[i].main.temp,
							data.list[i].main.humidity,
							data.list[i].wind.speed,
						);

						$("#forecast").append(fiveDayForecast);
					}
				}
			},
		});
	}

	/* -- ||  Open Weather Map || -- */
	/* © Garrett Dobson */
	console.log("-- || Open Weather Map API || --");
	// Global weather variables
	var imperialUnits = "&units=imperial";
	var apiWeatherKey = "&appid=f18b83f11c206025350af3f0978bacde";
	// Initial trip functions
	// forecast
	function genForecastHTML(name, fivedatestr, icon, temp, humidity, speed) {
		var forecastWeather = `<div class="card-forecast bg-light" style="width: 20%;">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text"> ${fivedatestr} </p>
                        <img src="https://openweathermap.org/img/w/${icon}.png">
                        <p class="card-text">Temperature: ${temp} °F</p>
                        <p class="card-text">Humidity: ${humidity} %</p>
                        <p class="card-text">Wind Speed: ${speed} MPH</p>
                    </div>
                </div>`;
		return forecastWeather;
	}
	//5 day forecast of city you're going to
	function getForecast(formData) {
		$.ajax({
			type: "GET",
			url:
				"https://api.openweathermap.org/data/2.5/forecast?q=" +
				formData[2].value +
				"&units=imperial" +
				apiWeatherKey,
			dataType: "json",
			success: function (data) {
				for (var i = 0; i < data.list.length; i++) {
					if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
						var fiveSec = data.list[i].dt;
						var fiveForecastDate = new Date(fiveSec * 1000);
						var fiveDateStr = fiveForecastDate.toLocaleDateString();
						var fiveDayForecast = genForecastHTML(
							data.city.name,
							fiveDateStr,
							data.list[i].weather[0].icon,
							data.list[i].main.temp,
							data.list[i].main.humidity,
							data.list[i].wind.speed,
						);
						$("#forecast").append(fiveDayForecast);
					}
				}
			},
		});
	}
	// current weather at departing city
	function searchWeather(formData) {
		$.ajax({
			url:
				"https://api.openweathermap.org/data/2.5/weather?q=" +
				formData[0].value +
				"&units=imperial" +
				apiWeatherKey,
			type: "GET",
			dataType: "json",
			success: function (data) {
				var correctFinalDate0 = moment(formData[1].value).format("l");
				var currentDate = data.dt;
				var todaysDate = new Date(currentDate * 1000);
				var departDateStr = todaysDate.toLocaleDateString();
				if (correctFinalDate0 !== departDateStr) {
					var currentWeather0a = `<div class="card bg-light" id="weather1" style="width: 100%;">
        <div class="card-body">
                    <h5 class="card-title">${data.name}</h5>
                    <p class="card-text">${departDateStr}</p>
                    <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
          <p class="card-text">Temperature: ${data.main.temp} °F</p>
          <p class="card-text">Humidity: ${data.main.humidity}%</p>
                    <p class="card-text">Wind Speed: ${data.wind.speed} MPH</p>
                    <p class="card-text" id="disclaimer-depart">Weather for ${correctFinalDate0} is currently unavailable. Displaying current weather for ${departDateStr} </p>
        </div>
            </div>`;
					$("#today").html(currentWeather0a);
				} else {
					var currentWeather0b = `<div class="card bg-light" id ="weather2" style="width: 100%;">
        <div class="card-body">
                    <h5 class="card-title">${data.name}</h5>
                    <p class="card-text">${departDateStr}</p>
                    <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
          <p class="card-text">Temperature: ${data.main.temp} °F</p>
          <p class="card-text">Humidity: ${data.main.humidity}%</p>
                    <p class="card-text">Wind Speed: ${data.wind.speed} MPH</p>
        </div>
            </div>`;
					$("#today").html(currentWeather0b);
				}
			},
		});
	}
	// current weather at Arriving city location
	function searchWeatherReturn(formData) {
		$.ajax({
			url:
				"https://api.openweathermap.org/data/2.5/weather?q=" +
				formData[2].value +
				imperialUnits +
				apiWeatherKey,
			type: "GET",
			dataType: "json",
			success: function (data) {
				// Moment Date Conversion
				var correctFinalDate1 = moment(formData[3].value).format("l");
				// Weather Date Conversion
				var currentDate = data.dt;
				var todaysDate = new Date(currentDate * 1000);
				var departDateStr = todaysDate.toLocaleDateString();
				if (correctFinalDate1 !== departDateStr) {
					var returnCurrentWeather1a = `<div class="card bg-light" style="width: 100%;">
        <div class="card-body">
                    <h5 class="card-title">${data.name}'s Departing Weather</h5>
                    <p class="card-text">${departDateStr}</p>
                    <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
          <p class="card-text">Temperature: ${data.main.temp} °F</p>
          <p class="card-text">Humidity: ${data.main.humidity}%</p>
                    <p class="card-text">Wind Speed: ${data.wind.speed} MPH</p>
                    <p class="card-text" id="disclaimer-return">Weather for ${correctFinalDate1} is currently unavailable. Displaying current weather for ${departDateStr} </p>
        </div>
      </div>`;
					$("#return-today").html(returnCurrentWeather1a);
				} else {
					var returnCurrentWeather2a = `<div class="card bg-light" style="width: 100%;">
        <div class="card-body">
                    <h5 class="card-title">${data.name}</h5>
                    <p class="card-text">${departDateStr}</p>
                    <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
          <p class="card-text">Temperature: ${data.main.temp} °F</p>
          <p class="card-text">Humidity: ${data.main.humidity}%</p>
                    <p class="card-text">Wind Speed: ${data.wind.speed} MPH</p>
        </div>
      </div>`;
					$("#return-today").html(returnCurrentWeather2a);
				}
			},
		});
	}
	// return trip destination current weather
	function searchWeatherReturnDepart(formData) {
		$.ajax({
			url:
				"https://api.openweathermap.org/data/2.5/weather?q=" +
				formData[0].value +
				"&units=imperial" +
				apiWeatherKey,
			type: "GET",
			dataType: "json",
			success: function (data) {
				// Moment Date Conversion
				var correctFinalDate2 = moment(formData[1].value).format("l");
				// Weather Date Conversion
				var currentDate = data.dt;
				var todaysDate = new Date(currentDate * 1000);
				var departDateStr = todaysDate.toLocaleDateString();
				if (correctFinalDate2 !== departDateStr) {
					var returnCurrentWeather1b = `<div class="card bg-light" style="width: 100%;">
                    <div class="card-body">
                        <h5 class="card-title">${data.name}'s Current Weather</h5>
                        <p class="card-text">${departDateStr}</p>
                        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
                        <p class="card-text">Temperature: ${data.main.temp} °F</p>
                        <p class="card-text">Humidity: ${data.main.humidity}%</p>
                        <p class="card-text">Wind Speed: ${data.wind.speed} MPH</p>
                        <p class="card-text" id="disclaimer-return-destination">Weather for ${correctFinalDate2} is currently unavailable. Displaying current weather for ${departDateStr} </p>
                    </div>
                </div>`;
					$("#return-today-destination").html(returnCurrentWeather1b);
				} else {
					var returnCurrentWeather2b = `<div class="card bg-light" style="width: 100%;">
                    <div class="card-body">
                        <h5 class="card-title">${data.name}</h5>
                        <p class="card-text">${departDateStr}</p>
                        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
                        <p class="card-text">Temperature: ${data.main.temp} °F</p>
                        <p class="card-text">Humidity: ${data.main.humidity}%</p>
                        <p class="card-text">Wind Speed: ${data.wind.speed} MPH</p>
                    </div>
                </div>`;
					$("#return-today-destination").html(returnCurrentWeather2b);
				}
			},
		});
	}
	getForecast(formData);
	searchWeather(formData);
	searchWeatherReturn(formData);
	searchWeatherReturnDepart(formData);
});
