document.getElementById('fertilizer-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const N = document.getElementById('N').value;
    const P = document.getElementById('P').value;
    const K = document.getElementById('K').value;

    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ N: N, P: P, K: K })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').innerText = 'Recommended Fertilizer: ' + data.Fertilizer;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'An error occurred. Please try again.';
    });
});