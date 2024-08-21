/* PAGE THEME */

const bg = document.querySelector('html')
const title = document.querySelector('.title')

const theme = localStorage.getItem('theme')
bg.classList.remove('reg', 'alt', 'light', 'war-bg')
bg.classList.add(theme)

function toggleMode() {
    let theme = bg.classList.value
    let currentTheme = ''
    if (theme === 'reg') {
        bg.classList.remove('reg', 'alt', 'light', 'war-bg')
        bg.classList.add('alt')
        currentTheme = 'alt'
    } else if (theme === 'alt') {
        bg.classList.remove('reg', 'alt', 'light', 'war-bg')
        bg.classList.add('light')
        title.classList.add('red')
        myCountEl.classList.add('red')
        botCountEl.classList.add('red')
        currentTheme = 'light'
    } else if (theme === 'light') {
        bg.classList.remove('reg', 'alt', 'light', 'war-bg')
        bg.classList.add('war-bg')
        title.classList.remove('red')
        currentTheme = 'war-bg'
        myCountEl.classList.remove('red')
        botCountEl.classList.remove('red')
    } else {
        bg.classList.remove('reg', 'alt', 'light', 'war-bg')
        bg.classList.add('reg')
        currentTheme = 'reg'
    }
    localStorage.setItem('theme', currentTheme)
}

/* PLAYER INFORMATION */

const myCountEl = document.getElementById('myCountEl')
const botCountEl = document.getElementById('botCountEl')

const p1El = document.querySelector('#p1')
const p2El = document.querySelector('#p2')

const p1Card = document.getElementById('player1')
const p2Card = document.getElementById('player2')

let myCount = Number(localStorage.getItem('myCount'))
let botCount = Number(localStorage.getItem('botCount'))
myCountEl.innerText = myCount
botCountEl.innerText = botCount

/*

Planning to add features to customize player names and choose an avatar

*/

/* GAME CONTROLS */

const startBtn = document.querySelector('#startGame')
const toggleBtn = document.querySelector('#toggle')
const warEl = document.querySelector('.warEl')


/* START GAME */

document.querySelector('#startGame').addEventListener('click', getDeck)
document.querySelector('#toggle').addEventListener('click', toggleMode)
document.querySelector('#draw').addEventListener('click', draw)

async function getDeck() {
    document.querySelector('#draw').addEventListener('click', draw)

    startBtn.innerText = 'NEW GAME'
    myCountEl.innerText = 26
    botCountEl.innerText = 26
    warEl.innerText = ''

    try {
        const res = await fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        const data = await res.json()

        console.log(data)
        localStorage.clear()
        localStorage.setItem('deckId', data.deck_id)
        p1Card.src = ''
        p2Card.src = ''
        myCount = 26
        botCount = 26
        p1El.innerText = ''
        p2El.innerText = ''

        localStorage.setItem('myCount', myCount)
        localStorage.setItem('botCount', botCount)
    }

    catch {
        const err = `Error: Failed to retreive new deck`
        console.log(err)
    }

    /* USING PILES TO KEEP TRACK OF CARDS  */

    /*
    const deckId = localStorage.getItem('deckId')

    myDrawPile = `https://www.deckofcardsapi.com/api/deck/${deckId}/pile/myDrawPile/add/?cards=`
    mySidePile = `https://www.deckofcardsapi.com/api/deck/${deckId}/pile/mySidePile/add/?cards=`
    botDrawPile = `https://www.deckofcardsapi.com/api/deck/${deckId}/pile/botDrawPile/add/?cards=`
    botSidePile = `https://www.deckofcardsapi.com/api/deck/${deckId}/pile/botSidePile/add/?cards=`
    */


}

/* DRAWING CARDS */

async function draw() {
    /*

    Functinality to be added for tracking player cards. Each player will have two piles, one to draw from, and one to store the cards won. When the draw pile is empty, cards won will be shuffled and moved to the draw pile.

    A potential twist will be added to allow for cards to be 'raided' when certain conditions are met

    */
    const deckId = localStorage.getItem('deckId')
    const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
    const shuffle = `https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/`

    warEl.innerText = ''

    try {
        const drawRes = await fetch(url)
        const data = await drawRes.json()

        if (!data.error) {
            console.log(data)
            let cards = data.cards
            let myCard = cards[0]
            let botCard = cards[1]

            p1Card.src = cards[0].image
            p2Card.src = cards[1].image

            determineWinner(cards, myCard, botCard, 2)
        } else {
            try {
                const shuffleRes = await fetch(shuffle)
                const data = await shuffleRes.json()
                console.log('Deck Shuffled', data)
            }
            catch {
                const err = `Error: Failed to shuffle cards`
                console.log(err)
            }
            try {
                const drawRes = await fetch(url)
                const data = await drawRes.json()

                if (!data.error) {
                    console.log(data)
                    let cards = data.cards
                    let myCard = cards[0]
                    let botCard = cards[1]

                    p1Card.src = cards[0].image
                    p2Card.src = cards[1].image

                    determineWinner(cards, myCard, botCard, 2)
                }
            }
            catch {
                const err = `Error: Failed to draw cards`
                console.log(err)
            }
        }
    }
    catch {
        const err = `Error: Failed to draw cards`
        console.log(err)
    }
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
        myCountEl.classList.remove('red')
        botCountEl.classList.remove('red')
        warEl.innerHTML = `<button id='war'>WAR!</button>`
        document.querySelector('#draw').removeEventListener('click', draw)
        document.querySelector('#war').addEventListener('click', war)
    }

    myCountEl.innerText = `${myCount}`
    botCountEl.innerText = `${botCount}`

    localStorage.setItem('myCount', myCount)
    localStorage.setItem('botCount', botCount)
}

async function war() {
    /*

    Game currently crashes and needs to be reset when there isn't enough cards in the deck to draw for war, should be fixed when the functionality for tracking cards with piles is added

    */
    let deckId = localStorage.getItem('deckId')
    const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=8`
    const shuffle = `https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/`

    localStorage.getItem('theme')
    bg.classList.remove('war')
    if (theme === 'light') {
        title.classList.add('red')
        myCountEl.classList.add('red')
        botCountEl.classList.add('red')
    }

    try {
        const warRes = await fetch(url)
        const data = await warRes.json()
        console.log(data)

        if (data.remaining === 0) {
            try {
                const warShuffleRes = await fetch(shuffle)
                const data = warShuffleRes.json()
                console.log(data)

                warEl.innerHTML = `<button id="war" type="button" name="button">WAR!</button>`
                document.querySelector('#draw').removeEventListener('click', draw)
                document.querySelector('#war').addEventListener('click', war)
            }
            catch {
                const err = `Error: Failed to shuffle cards`
                console.log(err)
            }
        }
        let cards = data.cards
        let myCard = cards[6]
        let botCard = cards[7]

        p1Card.src = cards[6].image
        p2Card.src = cards[7].image

        determineWinner(cards, myCard, botCard, 10)
    }

    catch {
        const err = `Error: Failed to draw war cards`
        console.log(err)
    }

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

