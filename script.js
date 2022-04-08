const countryContainer = document.querySelector(".countries");
const countryTemplate = document.querySelector(".country--template");

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
	renderCountry(data[0]);
}

async function getCountryDataByRegion(region) {
	const res = await fetch(`https://restcountries.com/v3.1/region/${region}`);
	const data = await res.json();
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
	).innerHTML = `<span>Population:</span> ${data.population}`;
	countryEl.querySelector(
		".country__row--region"
	).innerHTML = `<span>Religion:</span> ${data.region}`;
	countryEl.querySelector(
		".country__row--capital"
	).innerHTML = `<span>Capital:</span> ${data.capital}`;

	countryContainer.append(countryEl);
}

// getCountryDataAll();
// getCountryDataByName("germany");
getCountryDataByRegion("europe");
