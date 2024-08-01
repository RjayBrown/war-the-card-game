//Example fetch using pokemonapi.co
document.querySelector('#newGame').addEventListener('click', getDeck)
document.querySelector('#draw').addEventListener('click', draw)
document.querySelector('#war').addEventListener('click', war)

let cardImg1 = document.getElementById('player1')
let cardImg2 = document.getElementById('player2')

let myCountEl = document.getElementById('myCountEl')
let botCountEl = document.getElementById('botCountEl')
let warEl = document.getElementById('war')

let myCount = Number(localStorage.getItem('myCount'))
let botCount = Number(localStorage.getItem('botCount'))

let myPile
let botPile

let myUrl
let botUrl

myCountEl.innerText = myCount
botCountEl.innerText = botCount

function getDeck() {
  const url = 'https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'

  myCountEl.innerText = 0
  botCountEl.innerText = 0
  warEl.innerText = ''

  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      localStorage.clear()
      localStorage.setItem('deckId', data.deck_id)
      cardImg1.src = ''
      cardImg2.src = ''
      myCount = 0
      botCount = 0
      myPile = []
      botPile = []

      let deckId = localStorage.getItem('deckId')
      localStorage.setItem('myCount', myCount)
      localStorage.setItem('botCount', botCount)

      myUrl = `https://www.deckofcardsapi.com/api/deck/${deckId}/pile/mypile/add/?cards=`
      botUrl = `https://www.deckofcardsapi.com/api/deck/${deckId}/pile/botpile/add/?cards=`
      fetch(myUrl)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
          console.log(data)
        })
        .catch(err => {
          console.log(`error ${err}`)
        });
      fetch(botUrl)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
          console.log(data)
        })
        .catch(err => {
          console.log(`error ${err}`)
        });
    })
    .catch(err => {
      console.log(`error ${err}`)
    })
}

function draw() {
  let deckId = localStorage.getItem('deckId')
  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`

  warEl.innerText = ''

  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      let cards = data.cards
      let myCard = cards[0]
      let botCard = cards[1]

      cardImg1.src = cards[0].image
      cardImg2.src = cards[1].image

      determineWinner(cards, myCard, botCard, 2)
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}

function determineWinner(cards, c1, c2, cardsWon) {
  let deckId = localStorage.getItem('deckId')

  myUrl = `https://www.deckofcardsapi.com/api/deck/${deckId}/pile/mypile/add/?cards=`
  botUrl = `https://www.deckofcardsapi.com/api/deck/${deckId}/pile/botpile/add/?cards=`

  myList = `https://www.deckofcardsapi.com/api/deck/${deckId}/pile/mypile/list`
  botList = `https://www.deckofcardsapi.com/api/deck/${deckId}/pile/botpile/list`

  for (let card in cards) {
    card.value = 'ACE' ? card.value = 14
      : card.value = 'KING' ? card.value = 13
        : card.value = 'QUEEN' ? card.value = 12
          : card.value = 'JACK' ? card.value = 11
            : card.value = Number(card.value)
  }

  if (c1.value > c2.value) {
    myCount += cardsWon
    fetch(myUrl + `${c1.code},${c2.code}`)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        // console.log(data)
      })
      .catch(err => {
        console.log(`error ${err}`)
      });
    fetch(myList)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data.piles.mypile.cards)
      })
      .catch(err => {
        console.log(`error ${err}`)
      });
  } else if (c1.value < c2.value) {
    botCount += cardsWon
    fetch(botUrl + `${c1.code},${c2.code}`)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        // console.log(data)
      })
      .catch(err => {
        console.log(`error ${err}`)
      });
    fetch(botList)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data.piles.botpile.cards)
      })
      .catch(err => {
        console.log(`error ${err}`)
      });
  } else {
    warEl.innerHTML = `<button id='war'>WAR!!!</button>`
  }

  myCountEl.innerText = `${myCount}`
  botCountEl.innerText = `${botCount}`

  localStorage.setItem('myCount', myCount)
  localStorage.setItem('botCount', botCount)
}

function war() {
  let deckId = localStorage.getItem('deckId')
  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=8`

  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      let cards = data.cards
      let myCard = cards[6]
      let botCard = cards[7]

      cardImg1.src = cards[6].image
      cardImg2.src = cards[7].image

      determineWinner(cards, myCard, botCard, 10)
      warEl.innerText = ''
    })
    .catch(err => {
      console.log(`error ${err}`)
    });

  localStorage.setItem('myCount', myCount)
  localStorage.setItem('botCount', botCount)
}