let scoreButtons = document.getElementsByClassName('scoreButton')
let plusButtons = document.getElementsByClassName('plus')

let tally = 0
let score = 0
let length = plusButtons.length

for (let i = 0; i < plusButtons.length; i++) {
  plusButtons[i].addEventListener('click', function() {
    score++
  })
}

for (let i = 0; i < scoreButtons.length; i++) {
  scoreButtons[i].addEventListener('click', function() {
    this.parentNode.parentNode.style.display='none'
    tally++
    console.log('Tally: ', tally, ' | Score: ', score)
    if(tally === length) {
      console.log('Gameover')
      window.location.href = '/gameover/' + score + '/' + tally;
    }
  })
}
