const url = 'https://pixabay.com/api/?';
const apiKey = '23506912-73bfb79696cc6a5c5956b951b';
const form = document.querySelector('form');
const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');

let previousPageState = document.getElementById('previous');
let nextPageState = document.getElementById('next');
let searchValue = document.getElementById('search');
let colorValue = document.getElementById('color');

previousPageState.style.visibility = 'hidden';
nextPageState.style.visibility = 'hidden';
content.style.visibility = 'hidden';
page.style.visibility = 'hidden';

let searchTerm;
let selectedColor;
let currentPage = 1;
let perPage = 10;

function createParams(){
    const params = new URLSearchParams({
        key: apiKey,
        q: searchTerm,
        colors: selectedColor,
        per_page: perPage,
        page: currentPage
    });

    return params;
}

function loadPage(json){
    content.replaceChildren();

    previousPageState.style.visibility = 'visible';
    nextPageState.style.visibility = 'visible';
    document.getElementById('page').style.visibility = 'visible';

    /* Loops through all hits and builds up each individual search result that contains an image,
    the tags and who has made the image. */
    for (let i=0; i < json.hits.length; i++) {
        const picture = document.createElement('picture');
        content.append(picture);
 
        const img = document.createElement('img');
        img.src = json.hits[i].webformatURL;
        picture.append(img);
         
        const h2 = document.createElement('h2');
        h2.textContent = json.hits[i].tags;
        picture.append(h2);
 
        const p = document.createElement('p');
        p.textContent = ('taken by: ' + json.hits[i].user);
        picture.append(p);
    }

    let totalPages = Math.ceil(json.totalHits / perPage);

    page.replaceChildren();
    page.append(currentPage + '/' + totalPages);

    // Disables or enables the previous and next buttons depending on the current page and how many pages there are in total.
    if(totalPages==1){
        previousPageState.disabled=true;
        nextPageState.disabled=true;
    }
    else if(currentPage==1){
        previousPageState.disabled=true;
        nextPageState.disabled=false;
    }
    else if(currentPage==totalPages){
        previousPageState.disabled=false;
        nextPageState.disabled=true;
    }
    else{
        previousPageState.disabled=false;
        nextPageState.disabled=false;
    }
}

form.onsubmit = async event => {
    event.preventDefault();
    
    document.getElementById('content').style.visibility = 'visible';

    searchTerm = searchValue.value;
    selectedColor = colorValue.value;
    currentPage = 1;

    const params = createParams();

    const response = await fetch(url + params.toString());
    const json = await response.json();

    loadPage(json);
}

nextButton.onclick = async event => {
    event.preventDefault();

    searchValue.value = searchTerm;
    colorValue.value = selectedColor;

    currentPage++;

    const params = createParams();

    const response = await fetch(url + params.toString());
    const json = await response.json();

    loadPage(json);
}

previousButton.onclick = async event => {
    event.preventDefault();

    searchValue.value = searchTerm;
    colorValue.value = selectedColor;

    currentPage--;

    const params = createParams();

    const response = await fetch(url + params.toString());
    const json = await response.json();

    loadPage(json);
}