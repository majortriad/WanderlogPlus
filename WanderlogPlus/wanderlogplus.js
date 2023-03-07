const flights = document.getElementsByClassName("FlightsSectionItemView__smallCaps");

for (let flight of flights) {
    let splitFlight = flight.textContent.split(" ");
    let flightNum = splitFlight.pop();
    let airlineIataCode = splitFlight.pop();
    let airlineFull = splitFlight.join(" ");

    getIcaoCodeFromIataCode(airlineIataCode).then(function (checkCode) {
        let codeJsonString = "[" + checkCode.substring(checkCode.indexOf("\n") + 1).replace(/(\n|\\n)/g, ",") + "]"
        let codeJson = JSON.parse(codeJsonString);
        airlineIcaoCode = codeJson[0].icao;
        createFlightTrackButton(flight, airlineIcaoCode, flightNum);
    });

    let flightDateSection = flight.parentElement.getElementsByClassName("FlightsSectionItemView__date")[0].firstChild.innerText;
    let checkDate = flightDateSection.split(", ")[1] + new Date().getFullYear();
    let parsedDate = new Date(checkDate);
    if (new Date() > parsedDate) {
        parsedDate.setFullYear(parsedDate.getFullYear() + 1);
    }
    let formattedDate = (parsedDate.getMonth() + 1) + "/" + parsedDate.getDate() + "/" + parsedDate.getFullYear();
    console.log("Searching for seat maps matching flight " + airlineIataCode + flightNum + " on " + formattedDate);
    getSeatGuruResponse(airlineIataCode, flightNum, formattedDate).then(function (response) {
        console.log(response);
        let seatMapMatch = response.match(/(?<=view-map-button" href=").+(?=">)/g);
        if (seatMapMatch) {
            let seatMapUrl = seatMapMatch[0];
            createSeatGuruButton(flight, seatMapUrl);
        }
    });
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

function createSeatGuruButton(flightElement, seatMapUrl) {
    let button = document.createElement("button");
    button.className = "Button Button__light-gray Button__sm Button__shape__pill overflow-hidden Button__inline Button__withLabel Button__roundedExtreme";
    button.type = "Button";
    button.onclick = function () { openSeatGuru(seatMapUrl) };

    let div1 = document.createElement("div");
    div1.className = "flex-grow-1 flex-shrink-1 minw-0";

    let div2 = document.createElement("div");
    div2.className = "Button__label flex-shrink-1 minw-0 px-2";

    let span = document.createElement("span");
    span.textContent = "Seat Guru";
    span.className = "Button__labelText flex-shrink-1 minw-0"

    div2.appendChild(span);
    div1.appendChild(div2);
    button.appendChild(div1);

    flightElement.parentNode.after(button);
}

function getSeatGuruResponse(airlineIataCode, flightNo, flightDate) {
    return fetch("https://www.seatguru.com/ajax/findseatmap.php?flightno=" + flightNo + "&carrier=" + airlineIataCode + "&date=" + flightDate)
        .then(function (response) { return response.text() });
}

function getIcaoCodeFromIataCode(iataCode) {
    const form = new FormData();
    form.append("iata", iataCode);

    const options = {
        method: 'POST',
        body: form
    };

    return fetch("https://openflights.org/php/alsearch.php", options)
        .then(function (response) { return response.text() });
}

function openTracker(airlineCode, flightNo) {
    window.open("https://flightaware.com/live/flight/" + airlineCode + flightNo, "_blank");
}

function openSeatGuru(url) {
    window.open("https://www.seatguru.com" + url)
}