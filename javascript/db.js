// firebase
const db = firebase.firestore();

const div = document.querySelector('#results');
const searchField = document.querySelector('.searchBox');

// ALL FUNCTIONS --------------------------------------------------------
const displayResult = function(obj) {
    if (obj.Personnummer) {
        let html = `
        <div class="eier" id="${obj.Personnummer}">
            <h3>Navn: ${obj.Navn}</h3>
            <p><b>Kontaktspråk:</b> ${obj.Kontaktspråk}</p>
            <p><b>Tlf:</b> ${obj.Telefonnummer}</p>
            <p><b>Personnummer:</b> ${obj.Personnummer}</p>
        </div>
        `;

        div.innerHTML += html;
    } else if (obj.id.length === 6) {
        let html = `
        <div class="flokk" id="${obj.id}">
            <h3>Flokknavn: ${obj.Flokknavn}</h3>
            <p><b>Eier:</b> ${obj.Eier}</p>
            <p><b>Serieinndeling:</b> ${obj.Serieinndeling}</p>
            <p><b>Buemerke:</b> ${obj.Buemerke}</p>
        </div>
        `;

        div.innerHTML += html;
    } else if (obj.id.length === 9) {
        let html = `
        <div class="reinsdyr" id="${obj.id}">
            <h3>Navn: ${obj.Navn}</h3>
            <p><b>Fødselsdato:</b> ${obj.Fødselsdato}</p>
            <p><b>Tilhørighet:</b> ${obj.Flokk_tilhørighet}</p>
            <p><b>Serienummer:</b> ${obj.Serienummer}</p>
        </div>
        `;

        div.innerHTML += html;
    } else if (obj.id.length === 5) {
        let html = `
        <div class="beiteområde" id="${obj.Navn}">
            <h3>Navn: ${obj.Navn}</h3>
            <p><b>Fylke:</b> ${obj.Fylke}</p>
        </div>
        `;

        div.innerHTML += html;
    }
}

const displayObjs = function(objs) {
    objs.forEach(obj => {
        displayResult(obj);
    });
}

const searchProperties = function(rawInput, array) {
    if (rawInput.trim().length === 0) {
        displayObjs(array);
    } else {
        let newArr = array.slice(0); // function should be non-destructive
        const inputs = rawInput.trim().toLowerCase().split(' ');

        newArr.forEach(obj => {
            obj.Relevance = 0;
            let allProps = '';
            for (prop in obj) {
                if (prop !== 'id') {
                    allProps += obj[prop];
                }
            }

            inputs.forEach(input => {
                if (allProps.toLowerCase().includes(input)) {
                    obj.Relevance += input.length;
                }
            });
        });

        newArr.sort((a, b) => b.Relevance - a.Relevance);
        let lastLoop = false;
        let i = 0;
        newArr.forEach(obj => {
            if (lastLoop) {
                return;
            } else {
                if (obj.Relevance < 1) {
                    newArr.length = i;
                }
                i++;
            }
        });

        displayObjs(newArr);
    }
}

// RUN -------------------------------------------------------------------------------------

// fetch data
let dataArr = [];
db.collection('eier').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        const data = doc.data();
        dataArr.push(data);
    });
    db.collection('flokk').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            dataArr.push(data);
        });
        db.collection('reinsdyr').get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                dataArr.push(data);
            });
                // search on refresh
                searchProperties(searchField.value, dataArr);
            });
        });
    });

// search field
searchField.addEventListener('input', () => {
    // clear tidligere elementer
    div.innerHTML = '';

    // search through array
    searchProperties(searchField.value, dataArr);
});


// 1. make a variable for the input field
// 2. make a function for displaying the info using html templates
// 3. add an eventlistener to the inputfield that activates on button press (or pressing enter, depends what you wanna do)
// 4. Cycle through all of your collections and check if the value of the input field is equal to one of the fields of each document
// 5. If matches, run the display command with the current variable, if it doesn't, go to next item


// [
//     {"Navn": "Ter", "Fylke": "Finland", "id": "74989"},
//     {"Navn": "Kildin", "Fylke": "Finland", "id": "92975"},
//     {"Navn": "Akkala", "Fylke": "Sverige", "id": "93284"},
//     {"Navn": "Skolt", "Fylke": "Sverige", "id": "28833"},
//     {"Navn": "Enare", "Fylke": "Troms og Finnmark", "id": "39283"},
//     {"Navn": "Nord", "Fylke": "Troms og Finnmark", "id": "29394"},
//     {"Navn": "Lule", "Fylke": "Nordland", "id": "28383"},
//     {"Navn": "Pite", "Fylke": "Nordland", "id": "38338"},
//     {"Navn": "Ume", "Fylke": "Nordland", "id": "38328"},
//     {"Navn": "Sør", "Fylke": "Trøndelag", "id": "23828"}
// ]
[
    {"Flokknavn": "Gállok", "Serieinndeling": "R2-L", "Buemerke": "G3", "Eier": "01036410313", "id": "010832"},
    {"Flokknavn": "Guovdageaidnu", "Serieinndeling": "R5-S", "Buemerke": "G5", "Eier":" 02047510404", "id": "020385"},
    {"Flokknavn": "Ráhpes", "Serieinndeling": "R3-N", "Buemerke": "R7", "Eier": "17058301505", "id": "170398"},
    {"Flokknavn": "Suolu", "Serieinndeling": "R4-T", "Buemerke": "S9", "Eier": "25036803524", "id": "250487"},
    {"Flokknavn": "Ávžžil", "Serieinndeling": "R1-A", "Buemerke": "A1", "Eier": "11028907557", "id": "110920"},
    {"Flokknavn": "Álbmot", "Serieinndeling": "R6-B", "Buemerke": "A2", "Eier": "15048804747", "id": "150103"},
    {"Flokknavn": "Meara", "Serieinndeling": "R8-M", "Buemerke": "M7", "Eier": "05059602636", "id": "050761"},
    {"Flokknavn": "Nieida", "Serieinndeling": "R9-N", "Buemerke": "N5", "Eier": "29030115858", "id": "290489"},
    {"Flokknavn": "Boazu", "Serieinndeling": "R7-B", "Buemerke": "B1", "Eier": "28037101615", "id": "280928"},
    {"Flokknavn": "Guovdageainnu", "Serieinndeling": "R10-G", "Buemerke": "G1", "Eier": "07026102403", "id": "070872"}
]
[
    {"Navn": "Elen Nilsdatter", "Personnummer": "11028907557", "Kontaktspråk": "Lulesamisk", "Telefonnummer": "97654321"},
    {"Navn": "Mikkel Aslaksen", "Personnummer": "29030115858", "Kontaktspråk": "Nordsamisk", "Telefonnummer": "98765432"},
    {"Navn": "Lars Ingridson", "Personnummer": "15048804747", "Kontaktspråk": "Sørsamisk", "Telefonnummer": "49819039"},
    {"Navn": "Mari Nilsen", "Personnummer": "05059602636", "Kontaktspråk": "Nordsamisk", "Telefonnummer": "47929182"},
    {"Navn": "Sigbjørn Pettersen", "Personnummer": "28037101615", "Kontaktspråk": "Lulesamisk", "Telefonnummer": "93882919"},
    {"Navn": "Astrid Persen", "Personnummer": "17058301505", "Kontaktspråk": "Sørsamisk", "Telefonnummer": "93772273"},
    {"Navn": "Magnus Johansen", "Personnummer": "02047510404", "Kontaktspråk": "Nordsamisk", "Telefonnummer": "48592334"},
    {"Navn": "Johan Olsson", "Personnummer": "01036410313", "Kontaktspråk": "Lulesamisk", "Telefonnummer": "98273474"},
    {"Navn": "Karin Kristiansen", "Personnummer": "25036803524", "Kontaktspråk": "Nordsamisk", "Telefonnummer": "94827373"},
    {"Navn": "Elen Larsen", "Personnummer": "07026102403", "Kontaktspråk": "Sørsamisk", "Telefonnummer": "49287382"}
]
[
    {"navn": "Sárá", "flokk": "Gállok", "fødselsdato": "10. april, 2010", "Serienummer": "G2-2010", "id": "100410784"},
    {"navn": "Beaivi", "flokk": "Guovdageaidnu", "fødselsdato": "15. januar, 2011", "Serienummer": "G5-2011", "id": "150111829"},
    {"navn": "Iđit", "flokk": "Ráhpes", "fødselsdato": "22. mai, 2012", "Serienummer": "R7-2012", "id": "220512103"},
    {"navn": "Mihkkal", "flokk": "Suolu", "fødselsdato": "18. august, 2013", "Serienummer": "S9-2013", "id": "180813647"},
    {"navn": "Nieidda", "flokk": "Ávžžil", "fødselsdato": "3. januar, 2014", "Serienummer": "A1-2014", "id": "30114946"},
    {"navn": "Boazobargu", "flokk": "Álbmot", "fødselsdato": "13. februar, 2015", "Serienummer": "A2-2015", "id": "130215428"},
    {"navn": "Mearagáhtten", "flokk": "Meara", "fødselsdato": "23. mars, 2016", "Serienummer": "M7-2016", "id": "230216828"},
    {"navn": "Nieidat", "flokk": "Nieida", "fødselsdato": "1. juli, 2017", "Serienummer": "N5-2017", "id": "010717626"},
    {"navn": "Boazosuohkan", "flokk": "Boazu", "fødselsdato": "12. september, 2018", "Serienummer": "B1-2018", "id": "120918921"},
    {"navn": "Guovdageainnut", "flokk": "Guovdageainnu", "fødselsdato": "18. november, 2019", "Serienummer": "G1-2019", "id": "181119567"}
]