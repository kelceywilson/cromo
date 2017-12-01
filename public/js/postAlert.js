
const image = document.getElementById('image')
const thumbsUp = document.getElementById('up')
const thumbsDown = document.getElementById('down')
const electionUpdate = document.getElementById('electionUpdate')

// randomNumber variable to hold photo_id
let randomNumber
// save current vote state so that unvote can be made instead of repeating vote
let direction = 'cleared'

const upVote = () => {
  thumbsUp.classList.add('fa-thumbs-up')
  thumbsUp.classList.remove('fa-thumbs-o-up')
  direction = 'upvotes'
}
const downVote = () => {
  thumbsDown.classList.add('fa-thumbs-down')
  thumbsDown.classList.remove('fa-thumbs-o-down')
  direction = 'downvotes'
}
const clearDownVote = () => {
  thumbsDown.classList.remove('fa-thumbs-down')
  thumbsDown.classList.add('fa-thumbs-o-down')
}
const clearUpVote = () => {
  thumbsUp.classList.remove('fa-thumbs-up')
  thumbsUp.classList.add('fa-thumbs-o-up')
}

const newImage = () => {
  randomNumber = Math.round(Math.random() * 49)
  image.src = 'https://picsum.photos/800/500/?image=' + randomNumber
  return randomNumber
}
image.addEventListener('click', () => {
  randomNumber = newImage()
  clearUpVote()
  clearDownVote()
  electionUpdate.innerHTML = ''
})

function voteSave (amount) {
  return fetch('/votes', {
    method: 'put',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: randomNumber,
      direction: direction,
      amount: amount
    })
  })
  .then(updatedVoteCount => updatedVoteCount.json())
}

// addEventListeners to thumbs to alter appearance when clicked
thumbsUp.addEventListener('click', () => {
  console.log(direction)
  if (direction === 'upvotes') {
    console.log('function to subtract upvote from db')
    voteSave(-1)
    clearUpVote()
    direction = 'cleared'
  } else {
    upVote()
    clearDownVote()
    voteSave(1)
    .then((election) => {
      console.log(election)
      electionUpdate.innerHTML = `Upvotes: ${election.upvotes}\nDownvotes: ${election.downvotes}`
    })
  }
})

thumbsDown.addEventListener('click', () => {
  console.log(direction)
  if (direction === 'downvotes') {
    console.log('function to subtract downvote from db')
    voteSave(-1)
    clearDownVote()
    direction = 'cleared'
  } else {
    downVote()
    clearUpVote()
    voteSave(1)
      .then((election) => {
        console.log(election)
        electionUpdate.innerHTML = `Upvotes: ${election.upvotes}\nDownvotes: ${election.downvotes}`
      })
  }
})

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    randomNumber = newImage()
  }
}
