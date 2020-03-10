let quotes = document.getElementById('quotes');
async function getData(url) {

    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'csrftoken': 'noforgeryallowed'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    });
    return await response.json();
}
document.onload = getData('/v1/read')
    .then((data) => {
        data.forEach((el) => {
            quotes.insertAdjacentHTML('beforeend', `<li>
            <p>Quote: ${el.quote}</p><p>Date Saved: ${el.date}</p></li>`)
        })
    });