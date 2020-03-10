let quoteText = document.querySelector('.quote').innerText;
async function postData(url = '', data = {}) {

    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'csrftoken': 'noforgeryallowed'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    return await response.json();
}
document.querySelector('.save-quote').addEventListener('click', () => {
    postData('/v1/create', { quote: quoteText })
        .then((data) => {
            console.log(data);
        });
})
document.querySelector('.new-quote').addEventListener('click', () => location.reload())