let quoteText = document.querySelector('.quote').innerText;
async function postData(url = '', data = {}) {

    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    return await response.json();
}
document.querySelector('.save-quote').addEventListener('click', () => {
    postData('/best', { quote: quoteText })
        .then((data) => {
            console.log(data);
        });
})
document.querySelector('.new-quote').addEventListener('click', () => location.reload())