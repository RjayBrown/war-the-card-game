//Example fetch using pokemonapi.co
document.querySelector('#newGame').addEventListener('click', getDeck)
document.querySelector('#draw').addEventListener('click', draw)

let card1 = document.getElementById('player1')
let card2 = document.getElementById('player2')

let myScoreEl = document.getElementById('myScoreEl')
let botScoreEl = document.getElementById('botScoreEl')

let myScore = localStorage.getItem('myScore')
let botScore = localStorage.getItem('myScore')


function getDeck() {
  const url = 'https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'

  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      localStorage.setItem('deckId', data.deck_id)
      card1.src = ''
      card2.src = ''
      myScore = 0
      botScore = 0

      myScoreEl.innerText = myScore
      botScoreEl.innerText = botScore
    })
    .catch(err => {
      console.log(`error ${err}`)
    })
}

function draw() {
  let deckId = localStorage.getItem('deckId')
  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`

  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      let cards = data.cards
      card1.src = data.cards[0].image
      card2.src = data.cards[1].image
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}

function determineWinner(cards, c1, c2) {
  for (let card in cards) {
    card.value = 'ACE' ? card.value = 14
      : card.value = 'KING' ? card.value = 13
        : card.value = 'QUEEN' ? card.value = 12
          : card.value = 'JACK' ? card.value = 11
            : card.value = Number(card.value)
  }

  if (c1 > c2) {
    myScore += 1
  } else if (c1 < c2) {
    botScore += 1
  }

  localStorage.setItem('myScore', myScore)
  localStorage.setItem('botScore', botScore)
}