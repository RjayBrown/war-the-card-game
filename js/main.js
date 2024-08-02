document.querySelector('#newGame').addEventListener('click', getDeck)

let cardImg1 = document.getElementById('player1')
let cardImg2 = document.getElementById('player2')

let myCountEl = document.getElementById('myCountEl')
let botCountEl = document.getElementById('botCountEl')
let warEl = document.querySelector('.war')
let p1El = document.querySelector('#p1')
let p2El = document.querySelector('#p2')

let myCount = Number(localStorage.getItem('myCount'))
let botCount = Number(localStorage.getItem('botCount'))

let myUrl
let botUrl

myCountEl.innerText = myCount
botCountEl.innerText = botCount

function getDeck() {
  document.querySelector('#draw').addEventListener('click', draw)

  const url = 'https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'

  myCountEl.innerText = 26
  botCountEl.innerText = 26
  warEl.innerText = ''

  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      localStorage.clear()
      localStorage.setItem('deckId', data.deck_id)
      cardImg1.src = ''
      cardImg2.src = ''
      myCount = 26
      botCount = 26
      p1El.innerText = ''
      p2El.innerText = ''

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
  const shuffle = `https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/`

  warEl.innerText = ''

  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      if (!data.error) {
        console.log(data)
        let cards = data.cards
        let myCard = cards[0]
        let botCard = cards[1]

        cardImg1.src = cards[0].image
        cardImg2.src = cards[1].image

        determineWinner(cards, myCard, botCard, 2)
      } else {
        fetch(shuffle)
          .then(res => res.json()) // parse response as JSON
          .then(data => {
            console.log(data)
          })
          .catch(err => {
            console.log(`error ${err}`)
          });
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
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}

function determineWinner(cards, c1, c2, cardsWon) {

  for (let card in cards) {
    card.value = 'ACE' ? card.value = 14
      : card.value = 'KING' ? card.value = 13
        : card.value = 'QUEEN' ? card.value = 12
          : card.value = 'JACK' ? card.value = 11
            : card.value = Number(card.value)
  }

  if (c1.value > c2.value) {
    myCount += cardsWon
    botCount -= cardsWon
    if (+botCount <= 0) {
      botCount = 0
      myCount = 52
      botCountEl.innerText = `${botCount}`
      endGame()
    }
  } else if (c1.value < c2.value) {
    botCount += cardsWon
    myCount -= cardsWon
    if (+myCount <= 0) {
      myCount = 0
      botCount = 52
      myCountEl.innerText = `${myCount}`
      endGame()
    }
  } else {
    warEl.innerHTML = `<button id='war'>WAR!!!</button>`
    document.querySelector('#draw').removeEventListener('click', draw)
    document.querySelector('#war').addEventListener('click', war)
  }

  myCountEl.innerText = `${myCount}`
  botCountEl.innerText = `${botCount}`

  localStorage.setItem('myCount', myCount)
  localStorage.setItem('botCount', botCount)
}

function war() {
  let deckId = localStorage.getItem('deckId')
  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=8`
  const shuffle = `https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/`

  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      if (data.remaining === 0) {
        fetch(shuffle)
          .then(res => res.json()) // parse response as JSON
          .then(data => {
            console.log(data)
          })
          .catch(err => {
            console.log(`error ${err}`)
          });
      }
      let cards = data.cards
      let myCard = cards[6]
      let botCard = cards[7]

      cardImg1.src = cards[6].image
      cardImg2.src = cards[7].image

      determineWinner(cards, myCard, botCard, 10)
      document.querySelector('#draw').addEventListener('click', draw)
    })
    .catch(err => {
      console.log(`error ${err}`)
    });

  warEl.innerText = ''

  localStorage.setItem('myCount', myCount)
  localStorage.setItem('botCount', botCount)
}

function endGame() {
  if (+myCount === 0) {
    p2El.innerText = 'BOT WINS!!'
    document.querySelector('#draw').removeEventListener('click', draw)
  } else if (+botCount === 0) {
    p1El.innerText = 'YOU WIN!!'
    document.querySelector('#draw').removeEventListener('click', draw)
  }
}