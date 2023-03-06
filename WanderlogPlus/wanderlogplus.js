const flights = document.getElementsByClassName("FlightsSectionItemView__smallCaps");

for (let flight of flights) {
    var splitFlight = flight.textContent.split(" ");
    var flightNum = splitFlight.pop();
    var airlineCodeNum = splitFlight.pop();
    var airlineFull = splitFlight.join(" ");

    if (airlineCodeNum.length < 3) {
        getIcaoCodeFromIataCode(airlineCodeNum).then(function (checkCode) {
            var codeJsonString = "[" + checkCode.substring(checkCode.indexOf("\n") + 1).replace(/(\n|\\n)/g, ",") + "]"
            var codeJson = JSON.parse(codeJsonString);
            airlineCodeNum = codeJson[0].icao;
            createFlightTrackButton(flight, airlineCodeNum, flightNum);
        });
    } else {
        createFlightTrackButton(flight, airlineCodeNum, flightNum);
    }
}

function createFlightTrackButton(flightElement, airlineCode, flightNo) {
    let button = document.createElement("button");
    button.className = "Button Button__light-gray Button__sm Button__shape__pill overflow-hidden Button__inline Button__withLabel Button__roundedExtreme";
    button.type = "Button";
    button.onclick = function () { openTracker(airlineCode, flightNo) };

    let div1 = document.createElement("div");
    div1.className = "flex-grow-1 flex-shrink-1 minw-0";

    let div2 = document.createElement("div");
    div2.className = "Button__label flex-shrink-1 minw-0 px-2";

    let span = document.createElement("span");
    span.textContent = "Track flight";
    span.className = "Button__labelText flex-shrink-1 minw-0"

    div2.appendChild(span);
    div1.appendChild(div2);
    button.appendChild(div1);

    flightElement.parentNode.after(button);
}

function getIcaoCodeFromIataCode(iataCode) {
    const form = new FormData();
    form.append("iata", iataCode);

    const options = {
        method: 'POST',
        body: form
    };

    return fetch('https://openflights.org/php/alsearch.php', options)
        .then(function (response) { return response.text() });
}

function openTracker(airlineCode, flightNo) {
    window.open("https://flightaware.com/live/flight/" + airlineCode + flightNo, "_blank");
}