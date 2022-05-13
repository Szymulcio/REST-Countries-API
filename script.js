const countryContainer = document.querySelector(".countries");
const countryTemplate = document.querySelector(".country--template");
const countryDetailContainer = document.querySelector(".country--detail");

const countryFilterInput = document.querySelector(".country-filter__country");
const countryFilterContainer = document.querySelector(".country-filter--container");
const countryFilterRegion = document.querySelector(".country-filter__region");

const backBtn = document.querySelector(".btn--back");

let country = document.querySelector(".country");
let neighbourCountryBtn = document.querySelectorAll(".btn--neighbour");

let countryData;

async function getJSON(url) {
	const response = await fetch(url);
	return response.json();
}

async function getCountryData(url) {
	const data = await getJSON(url);

	for (const country of data) {
		renderCountry(country);
	}
	countryData = data;
}

async function getCountryDataByName(name) {
	const res = await fetch(`https://restcountries.com/v3.1/name/${name}`);
	const data = await res.json();
	for (const country of data) {
		renderCountry(country);
	}
}

// async function getCountryDataByRegion(region) {
// 	const res = await fetch(`https://restcountries.com/v3.1/region/${region}`);
// 	const data = await res.json();
// 	console.log(data);
// 	for (const country of data) {
// 		renderCountry(country);
// 	}
// }

function renderCountry(data) {
	const countryEl = document.importNode(countryTemplate.content, true);

	countryEl.querySelector(".country").dataset.name = data.name.common;
	countryEl.querySelector(".country").dataset.region = data.region;

	countryEl.querySelector("img").src = data.flags.png;
	countryEl.querySelector("h2").textContent = data.name.common;

	countryEl.querySelector(
		".country__row--population"
	).innerHTML = `<span>Population:</span> ${new Intl.NumberFormat(navigator.language).format(
		data.population
	)}`;
	countryEl.querySelector(
		".country__row--region"
	).innerHTML = `<span>Religion:</span> ${data.region}`;
	countryEl.querySelector(
		".country__row--capital"
	).innerHTML = `<span>Capital:</span> ${data.capital}`;

	countryContainer.append(countryEl);
	country = document.querySelectorAll(".country");
}

async function renderCoutryDetails(data) {
	console.log(data);
	function currencyFinder() {
		let currencyList = "";
		for (const value of Object.values(data.currencies)) {
			currencyList += ` ${value.name},`;
		}
		return currencyList.slice(0, -1);
	}

	function languagesFinder() {
		let languageList = "";
		for (const value of Object.values(data.languages)) {
			languageList += ` ${value},`;
		}
		return languageList.slice(0, -1);
	}

	// TODO : ADD FINFING NEIGHBOURS BY CC3 CODE
	async function borderFinder() {
		let borderList = "<ul class='country__row country__row--neighbour'>";
		if (data.borders) {
			for (const value of Object.values(data.borders)) {
				const neigbour = countryData.filter(el => el.cca3 === value);
				borderList += `<li><button class="btn btn--neighbour">${neigbour[0].name.common}</button></li>`;
			}
		} else
			borderList = `<p class='country__row'>${data.name.common} doesn't have border countries</p>`;
		borderList += "</ul>";
		return borderList;
	}

	const html = `
	<img class="country__img country__img--detail" src="${data.flags.png}" alt="flag">
	<div class="country__data">
		<h2 class="country__row country__row--name">${data.name.common}</h2>
		<p class="country__row country__row--population"><span>Native Name:</span> ${
			data.altSpellings[1]
		}</p>
		<p class="country__row country__row--population"><span>Population:</span> ${data.population}</p>
		<p class="country__row"><span>Region:</span> ${data.region}</p>
		<p class="country__row"><span>Sub Region:</span> ${data.subregion}</p>
		<p class="country__row"><span>Capital:</span> ${data.capital}</p>
		<p class="country__row" style="opacity:0;"><span>Capital:</span></p>
		<p class="country__row"><span>Top Level Domain:</span> ${data.tld}</p>
		<p class="country__row"><span>Currencies:</span>${currencyFinder()}</p>
		<p class="country__row"><span>Languages:</span>${languagesFinder()}</p>
		<h3 class="country__row"><span>Border Countries:</span></h3>
		${await borderFinder()}		
		<p class="country__row" style="opacity:0;"><span>Capital:</span></p>
	</div>`;

	countryDetailContainer.insertAdjacentHTML("afterbegin", html);
	neighbourCountryBtn = document.querySelectorAll(".btn--neighbour");
}

function changeDisplay() {
	countryContainer.classList.toggle("hidden");
	countryFilterContainer.classList.toggle("hidden");
	countryFilterRegion.classList.toggle("hidden");

	backBtn.classList.toggle("hidden");
}

function hideCountries() {
	country.forEach(c => c.classList.add("hidden"));
}

function showCountries(region = "", name = "") {
	country.forEach(c => {
		if (c.dataset.region === region || c.dataset.name === name) c.classList.remove("hidden");
	});
}

//////////////////
// Event listeners
/////////////////

/// Name filter
countryFilterInput.addEventListener("input", function () {
	countryContainer.innerHTML = "";
	const countryName = countryFilterInput.value;
	if (countryName !== "") getCountryDataByName(countryName);
	else getCountryData("https://restcountries.com/v3.1/all");
});

/// Region filter
countryFilterRegion.addEventListener("change", function () {
	hideCountries();
	if (this.value === "default") {
		showCountries();
	} else {
		showCountries(this.value);
	}
});

/// Detail country
countryContainer.addEventListener("click", function (e) {
	const clicked = e.target.closest(".country");
	const selectedCountryName = clicked.querySelector("h2").textContent;

	const selectedCountry = countryData.filter(el => el.name.common === selectedCountryName);
	renderCoutryDetails(selectedCountry[0]);
	changeDisplay();
});

/// Back to preview display
backBtn.addEventListener("click", function () {
	countryDetailContainer.innerHTML = "";

	changeDisplay();
});

/// Detail neighbour
countryDetailContainer.addEventListener("click", function (e) {
	if (e.target.classList.contains("btn--neighbour")) {
		countryDetailContainer.innerHTML = "";

		const selectedCountry = countryData.filter(el => el.name.common === e.target.innerHTML);
		renderCoutryDetails(selectedCountry[0]);
	}
});

getCountryData("https://restcountries.com/v3.1/all");
