localStorage.getItem('theme')

document.querySelector('#startGame').addEventListener('click', getDeck)
document.querySelector('#toggle').addEventListener('click', toggleMode)

let bg = document.querySelector('body')
let title = document.querySelector('.title')

let cardImg1 = document.getElementById('player1')
let cardImg2 = document.getElementById('player2')

let startBtn = document.querySelector('#startGame')
let toggleBtn = document.querySelector('#toggle')
let myCountEl = document.getElementById('myCountEl')
let botCountEl = document.getElementById('botCountEl')
let warEl = document.querySelector('.warEl')
let p1El = document.querySelector('#p1')
let p2El = document.querySelector('#p2')

let myCount = Number(localStorage.getItem('myCount'))
let botCount = Number(localStorage.getItem('botCount'))

// for using piles
// let myUrl
// let botUrl

myCountEl.innerText = myCount
botCountEl.innerText = botCount

/* TOGGLE LIGHT OR DARK MODE */

function toggleMode() {
  let theme = Array.from(bg.classList)[0]
  if (theme === 'reg') {
    bg.classList.remove('reg')
    bg.classList.add('dark')
  } else if (theme === 'dark') {
    bg.classList.remove('dark')
    bg.classList.add('light')
    title.classList.add('red')
  } else if (theme === 'light') {
    bg.classList.remove('light')
    bg.classList.add('war-bg')
    title.classList.remove('red')
  } else {
    bg.classList.remove('war-bg')
    bg.classList.add('reg')
  }
  // localStorage.setItem('theme', theme)
}

/* START GAME */

function getDeck() {
  document.querySelector('#draw').addEventListener('click', draw)

  const url = 'https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'

  startBtn.innerText = 'NEW GAME'
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

      localStorage.setItem('myCount', myCount)
      localStorage.setItem('botCount', botCount)


      /* USING PILES TO KEEP TRACK OF CARDS  */

      // let deckId = localStorage.getItem('deckId')

      // myUrl = `https://www.deckofcardsapi.com/api/deck/${deckId}/pile/mypile/add/?cards=`
      // botUrl = `https://www.deckofcardsapi.com/api/deck/${deckId}/pile/botpile/add/?cards=`
      // fetch(myUrl)
      //   .then(res => res.json()) // parse response as JSON
      //   .then(data => {
      //     console.log(data)
      //   })
      //   .catch(err => {
      //     console.log(`error ${err}`)
      //   });
      // fetch(botUrl)
      //   .then(res => res.json()) // parse response as JSON
      //   .then(data => {
      //     console.log(data)
      //   })
      //   .catch(err => {
      //     console.log(`error ${err}`)
      //   });
    })
    .catch(err => {
      console.log(`error ${err}`)
    })
}

/* DRAW */

function draw() {
  // Draw function must change if using piles
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
  // figure out how to add war count - # to multiply draw cards in war function API call

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
    document.querySelector('#draw').addEventListener('click', draw)
    if (+botCount <= 0) {
      botCount = 0
      myCount = 52
      botCountEl.innerText = `${botCount}`
      endGame()
    }
  } else if (c1.value < c2.value) {
    botCount += cardsWon
    myCount -= cardsWon
    document.querySelector('#draw').addEventListener('click', draw)
    if (+myCount <= 0) {
      myCount = 0
      botCount = 52
      myCountEl.innerText = `${myCount}`
      endGame()
    }
  } else {
    bg.classList.add('war')
    title.classList.remove('red')
    warEl.innerHTML = `<button id='war'>WAR!</button>`
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

  bg.classList.remove('war')

  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      if (data.remaining === 0) {
        fetch(shuffle)
          .then(res => res.json()) // parse response as JSON
          .then(data => {
            console.log(data)
            warEl.innerHTML = `<button id='war'>WAR!</button>`
            document.querySelector('#draw').removeEventListener('click', draw)
            document.querySelector('#war').addEventListener('click', war)
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
    p2El.classList.add('winner')
    p2El.innerText = 'BOT WINS!'
    startBtn.innerText = 'REMATCH'
    document.querySelector('#draw').removeEventListener('click', draw)
  } else if (+botCount === 0) {
    p1El.classList.add('winner')
    p1El.innerText = 'YOU WIN!'
    startBtn.innerText = 'REMATCH'
    document.querySelector('#draw').removeEventListener('click', draw)
  }
}