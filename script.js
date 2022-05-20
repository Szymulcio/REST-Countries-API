const countryContainer = document.querySelector(".countries");
const countryTemplate = document.querySelector(".country--template");
const countryDetailContainer = document.querySelector(".country--detail");

const countryFilterInput = document.querySelector(".country-filter__country");
const countryFilterContainer = document.querySelector(".country-filter--container");
const countryFilterRegion = document.querySelector(".country-filter__region");

const backBtn = document.querySelector(".btn--back");
const resetBtn = document.querySelector(".btn--reset");

let country = document.querySelector(".country");
let neighbourCountryBtn = document.querySelectorAll(".btn--neighbour");

let allCountryData;

async function getJSON(url) {
	const response = await fetch(url);
	return response.json();
}

async function getCountryData(url) {
	const data = await getJSON(url);
	allCountryData = data;
	allCountryData.sort((a, b) =>
		a.name.common > b.name.common ? 1 : b.name.common > a.name.common ? -1 : 0
	);

	for (const country of allCountryData) {
		renderCountry(country);
	}
}

async function getCountryDataByName(name) {
	const res = await fetch(`https://restcountries.com/v3.1/name/${name}`);
	const data = await res.json();
	for (const country of data) {
		renderCountry(country);
	}
}

function renderCountry(data) {
	const countryEl = document.importNode(countryTemplate.content, true);

	countryEl.querySelector(".country").dataset.name = data.name.common.toLowerCase();
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

	function currencyFinder() {
		let currencyList = "";
		for (const currency of Object.values(data.currencies)) {
			currencyList += ` ${currency.name},`;
		}
		return currencyList.slice(0, -1);
	}

	function languageFinder() {
		let languageList = "";
		for (const language of Object.values(data.languages)) {
			languageList += ` ${language},`;
		}
		return languageList.slice(0, -1);
	}

	function borderFinder() {
		let borderList = "<ul class='country__row country__row--neighbour'>";
		if (data.borders) {
			for (const borderCountryCode of Object.values(data.borders)) {
				const borderCountry = allCountryData.filter(country => country.cca3 === borderCountryCode);
				borderList += `<li><button class="btn btn--neighbour">${borderCountry[0].name.common}</button></li>`;
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
		<p class="country__row"><span>Languages:</span>${languageFinder()}</p>
		<h3 class="country__row"><span>Border Countries:</span></h3>
		${borderFinder()}		
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
	resetBtn.classList.toggle("hidden");
}

function hideCountries() {
	country.forEach(c => c.classList.add("hidden"));
}

function filterCountries() {
	let message = document.querySelector(".countries--message");
	const filteredName = countryFilterInput.value;
	const filteredRegion = countryFilterRegion.value;

	message.classList.remove("hidden");

	country.forEach(c => {
		if (c.dataset.region.includes(filteredRegion) && c.dataset.name.includes(filteredName)) {
			c.classList.remove("hidden");
			message.classList.add("hidden");
		}
	});
}

//////////////////
// Event listeners
/////////////////

/// Name filter
countryFilterInput.addEventListener("input", function () {
	hideCountries();
	filterCountries();
});

/// Region filter
countryFilterRegion.addEventListener("change", function () {
	hideCountries();
	filterCountries();
});

resetBtn.addEventListener("click", function () {
	countryFilterInput.value = "";
	countryFilterRegion.value = "";
	filterCountries();
});

/// Detail country
countryContainer.addEventListener("click", function (e) {
	const clicked = e.target.closest(".country");
	const selectedCountryName = clicked.querySelector("h2").textContent;

	const selectedCountry = allCountryData.filter(el => el.name.common === selectedCountryName);
	
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

		const selectedCountry = allCountryData.filter(el => el.name.common === e.target.innerHTML);
		renderCoutryDetails(selectedCountry[0]);
	}
});

getCountryData("https://restcountries.com/v3.1/all");
