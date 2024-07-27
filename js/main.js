//Example fetch using pokemonapi.co
document.querySelector('#newGame').addEventListener('click', getDeck)
document.querySelector('#draw').addEventListener('click', draw)

let card1 = document.getElementById('player1')
let card2 = document.getElementById('player2')

function getDeck() {
  const url = 'https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'

  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      localStorage.setItem('deckId', data.deck_id)
      card1.src = ''
      card2.src = ''
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}

function draw() {
  let deckId = localStorage.getItem('deckId')
  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`

  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      card1.src = data.cards[0].image
      card2.src = data.cards[1].image
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}

