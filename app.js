let TIME_TO_SEARCH = 'from=2020-03-01T00:00:00Z&to=2020-10-10T00:00:00Z'
let SLUG = ''
const INPUT = document.getElementById('countrySelector');
let STATUS = 'confirmed'


const getData = async () => {
    const data = await fetch(`https://api.covid19api.com/country/${SLUG}?${TIME_TO_SEARCH}`);

    const result = await data.json();
    console.log(result)
    return result

}

async function getCases () {
    const allCases = await getData();
    const allCasesLastPosition = allCases[allCases.length - 1]

    const confirmedCases = allCasesLastPosition.Confirmed
    const deaths = allCasesLastPosition.Deaths
    const active = allCasesLastPosition.Active
    const recovered = allCasesLastPosition.Recovered

    return {
        'confirmed': confirmedCases,
        'deaths': deaths,
        'active': active,
        'recovered': recovered
    };
}

const getCountries = async () => {
    const data = await fetch('https://api.covid19api.com/summary');
    const res = await data.json()
    const allCountries = res.Countries.map(({Country, Slug}) => {
        return {
            name: Country,
            slug:Slug
        }
    })
    let options = [`<select ${onchange = ((event)=>handleCountryChange(event))}><option>Global</option>`];

    allCountries.map(country =>{
       options.push(`<option value = '${country.slug}' >${country.name}</option>`)
    })
    options.push('</select>')
    
    INPUT.innerHTML = options
}

const handleCountryChange = (event) => {
    SLUG = event.target.value
    renderScreen()
}

const renderScreen = async () => {
    const cases = await getCases()
    console.log(cases)
    const confirmed = document.getElementById('confirmed');
    const deaths = document.getElementById('deaths');
    const active = document.getElementById('active');
    const recovered = document.getElementById('recovered');


    confirmed.textContent = "Total Confirmados: " + cases.confirmed.toLocaleString();
    deaths.textContent = "Total Mortos: " + cases.deaths.toLocaleString();
    active.textContent = "Total Ativos: " + cases.active.toLocaleString();
    recovered.textContent = "Total Recuperados: " + cases.recovered.toLocaleString();
}

getCountries();
renderScreen()