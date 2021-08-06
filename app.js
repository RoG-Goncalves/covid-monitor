let TIME_TO_SEARCH = '2021-08-04T00:00:00Z';
const INPUT = document.getElementById('countrySelector');
let STATUS = 'confirmed';
let SLUG = 'Global';


const getData = async () => {
    let data = null
    if (SLUG === 'Global'){
        data = await fetch('https://api.covid19api.com/summary');
        const result = await data.json();

        return result.Global;
    } else {

        data = await fetch(`https://api.covid19api.com/country/${SLUG}?from=2020-03-01T00:00:00Z&to=${TIME_TO_SEARCH}`);
        const result = await data.json();
       
        return result;
    }
}

async function getCases () {
    const allCases = await getData();
    if (SLUG !== 'Global'){
        const {Confirmed, Deaths, Active, Recovered} = allCases[allCases.length - 1];
        const allCasesPreviousLastPosition = allCases[allCases.length - 2];

        const previousConfirmedCases = allCasesPreviousLastPosition.Confirmed;
        const previousDeaths = allCasesPreviousLastPosition.Deaths;
        const previousActive = allCasesPreviousLastPosition.Active;
        const previousRecovered = allCasesPreviousLastPosition.Recovered;


        return {
            'confirmed': Confirmed,
            'deaths': Deaths,
            'active': Active,
            'recovered': Recovered,
            'previous_confirmed':previousConfirmedCases,
            'previous_deaths': previousDeaths,
            'previous_active': previousActive,
            'previous_recovered': previousRecovered
        };
    } else {
        const confirmedCases = allCases.TotalConfirmed;
        const deaths = allCases.TotalDeaths;
        const update = allCases.Date;
        const recovered = allCases.TotalRecovered;

        return {
            'confirmed': confirmedCases,
            'deaths': deaths,
            'update': update,
            'recovered': recovered
        };
    }

};

const getCountries = async () => {
    const data = await fetch('https://api.covid19api.com/summary');
    const res = await data.json()
    const allCountries = res.Countries.map(({Country, Slug}) => {
        return {
            name: Country,
            slug:Slug
        }
    });

    let options = [`<select ${onchange = ((event)=>handleCountryChange(event))}><option>Global</option>`];

    allCountries.map(country =>{
       options.push(`<option value = '${country.slug}' >${country.name}</option>`)
    });

    options.push('</select>');
    INPUT.innerHTML = options;
};

const handleCountryChange = (event) => {
    SLUG = event.target.value;
    renderScreen();
};

const calcDifference = (updated,previous) => {
    if(SLUG !== "Global"){
        const rest = (updated - previous);
        if(rest > 0) {
            return '⬆' + rest.toLocaleString()
        }
        return '⬇' + rest.toLocaleString()
    } return ''
}

const renderScreen = async () => {
    const cases = await getCases();

    const confirmed = document.getElementById('confirmed');
    const deaths = document.getElementById('deaths');
    const active = document.getElementById('active');
    const recovered = document.getElementById('recovered');

    confirmed.innerHTML = "Total Confirmados: " + cases.confirmed.toLocaleString() +'\n' + calcDifference(cases.confirmed,cases.previous_confirmed)
    deaths.innerHTML = "Total Mortos: " + cases.deaths.toLocaleString() +'\n' + calcDifference(cases.deaths,cases.previous_deaths);
    recovered.innerHTML = "Total Recuperados: " + cases.recovered.toLocaleString() +'\n' + calcDifference(cases.recovered,cases.previous_recovered);
    
    if (SLUG === 'Global'){
        let date = new Date(cases.update)
        active.innerHTML = "Atualização: " + date.toLocaleString('pt-BR', {hour12:false})
    } else {
        active.innerHTML = "Total Ativos: " + cases.active.toLocaleString() +'\n' + calcDifference(cases.active,cases.previous_active);
    }
}

getCountries();
renderScreen()