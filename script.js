const country = document.querySelector(".country");
const countryContainer = document.querySelector(".countries");
const countryTemplate = document.querySelector(".country--template");
const coutryFilterInput = document.querySelector(".country-filter__country");
const countryFilterRegion = document.querySelector(".country-filter__region");

async function getJSON(url) {
	const response = await fetch(url);
	return response.json();
}

async function getCountryDataAll() {
	const res = await fetch("https://restcountries.com/v3.1/all");
	const data = await res.json();

	for (const country of data) {
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

async function getCountryDataByRegion(region) {
	const res = await fetch(`https://restcountries.com/v3.1/region/${region}`);
	const data = await res.json();
	console.log(data);
	for (const country of data) {
		renderCountry(country);
	}
}

function renderCountry(data) {
	const countryEl = document.importNode(countryTemplate.content, true);

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
}

async function renderCoutryDetails(countryName) {
	const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
	const data = await res.json();
	const countryData = data[0];
	console.log(countryData);

	function currencyFinder() {
		let currencyList = "";
		for (const value of Object.values(countryData.currencies)) {
			currencyList += ` ${value.name},`;
		}
		return currencyList.slice(0, -1);
	}

	function languagesFinder() {
		let languageList = "";
		for (const value of Object.values(countryData.languages)) {
			languageList += ` ${value},`;
		}
		return languageList.slice(0, -1);
	}

	async function borderFinder() {
		let borderList = "";
		for (const value of Object.values(countryData.borders)) {
			console.log(value);
			const neigbour = await getJSON(`https://restcountries.com/v2/alpha?codes=${value}`);
			borderList += ` ${neigbour[0].name},`;
		}
		return borderList.slice(0, -1);
	}

	countryContainer.innerHTML = "";
	const html = `<section class="country-detail">
	<img class="country__img" src="${countryData.flags.png}" alt="flag">
	<div class="country__data">
		<h2 class="country__row country__row--name">${countryData.name.common}</h2>
		<p class="country__row country__row--population"><span>Native Name:</span> ${
			countryData.altSpellings[1]
		}</p>
		<p class="country__row country__row--population"><span>Population:</span> ${
			countryData.population
		}</p>
		<p class="country__row"><span>Region:</span> ${countryData.region}</p>
		<p class="country__row"><span>Sub Region:</span> ${countryData.subregion}</p>
		<p class="country__row"><span>Capital:</span> ${countryData.capital}</p>
		<p class="country__row" style="opacity:0;"><span>Capital:</span></p>
		<p class="country__row"><span>Top Level Domain:</span> ${countryData.tld}</p>
		<p class="country__row"><span>Currencies:</span>${currencyFinder()}</p>
		<p class="country__row"><span>Languages:</span>${languagesFinder()}</p>
		<h3 class="country__row"><span>Border Countries:</span></h3>
		<p class="country__row">${await borderFinder()}</p>
		
	</div>
</section>
	`;
	countryContainer.insertAdjacentHTML("afterbegin", html);
}

// getCountryDataAll();
// getCountryDataByName("germany");
getCountryDataByRegion("europe");

//////////////////
// Event listeners
coutryFilterInput.addEventListener("input", function () {
	countryContainer.innerHTML = "";
	const countryName = coutryFilterInput.value;
	if (countryName !== "") getCountryDataByName(countryName);
	else getCountryDataAll();
});

countryFilterRegion.addEventListener("change", function (e) {
	countryContainer.innerHTML = "";
	if (this.value !== "default") getCountryDataByRegion(this.value);
	else getCountryDataAll();
});

countryContainer.addEventListener("click", function (e) {
	// document.querySelector("main").innerHTML = "";
	const clicked = e.target.closest(".country");
	console.log(clicked);
	const selectedCountryName = clicked.querySelector("h2").textContent;
	renderCoutryDetails(selectedCountryName);
});
