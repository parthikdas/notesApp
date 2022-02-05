const api = 'http://localhost:3000/data'
const noteList = document.getElementById('note-list')
const editNoteArea = document.getElementById('edit-note')
const searchBar = document.getElementById('search')

document.addEventListener('DOMContentLoaded', () => {
    showNotes()
})
// Function to make new note card to show note in the note list
function newNoteCard(id, text, star) {
    // mainly there will a note div, inside it there will be 2 div, 1 is text another buttons
    let div = document.createElement('div')
    div.className = 'note'

    let noteText = document.createElement('div')
    noteText.id = id
    noteText.className = 'noteText'
    noteText.innerHTML = text
    noteText.onclick = function() { editNote(this.id) }
    div.append(noteText)


    let noteButtons = document.createElement('div')
    noteButtons.className = 'noteButtons'

    let dltButton = document.createElement('button')
    dltButton.innerHTML = '&odash;'
    dltButton.style = 'height: 2rem; width: 2rem; font-size: 1.6rem; color: crimson; background: transparent; border: none; cursor: pointer;'
    dltButton.onclick = function() { deleteNote() }
    noteButtons.append(dltButton)

    // let starButton = document.createElement('button')
    // starButton.id = 'starButton' + id
    // starButton.className = star ? 'star' : ''
    // starButton.innerHTML = star ? '&#9733;' : '&#9734;'
    // starButton.style = 'height: 2rem; width: 2rem; font-size: 1.6rem; color: rgb(235, 235, 30); background: transparent; border: none; cursor: pointer;'
    // starButton.onclick = function() { starNote(this.id) }
    // noteButtons.append(starButton)

    div.append(noteButtons)


    noteList.append(div)
}
// Function to show all existing notes
function showNotes() {
    // Remove all divs if present having class as note
    while (noteList.firstChild) {
        noteList.removeChild(noteList.firstChild);
    }
    fetch(api)
    .then(response => response.json())
    .then(data => {
        for(let i=0; i<data.length; i++) {
            //newNoteCard(i, data[i]['body'])
            newNoteCard(i, data[i]['body'], data[i]['star'])
        }
        editNote(noteList.firstChild.firstChild.id) // show 1st note in editNote Area, as noteList's first child is note and its first child have the id
    })
}
// Function to create a new note when newNote button is clicked to post new note
function postNewNote(text) {
    document.getElementById('new-note').disabled = true
    fetch(api)
    .then(response => response.json())
    .then(data => {
        // let i=0
        // while(data[i]['star'] === 1) i++
        // console.log(i)
        // data.splice(i, 0, { // new note at top
        //     id: data.length,
        //     body: text
        // })
        data.unshift({ // new note at top
            id: data.length,
            body: text
        })
        fetch(api, {
            method: "POST",
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => console.log(data))
        // After posting data reload the list
        showNotes()
    })
}

// Function to edit note
function editNote(id) {
    // if what the id came and notelist's grandchild is not same and notechild's grandchild is empty then remove that note from server as its empty
    if(id !== noteList.firstChild.firstChild.id && noteList.firstChild.firstChild.innerHTML === '') {
        fetch(api)
        .then(response => response.json())
        .then(data => {
            data.shift()
            fetch(api, {
                method: "POST",
                body: JSON.stringify(data)
            }).then(response => response.json())
            .then(data => console.log('Data posted : ' + data))
            document.getElementById('new-note').disabled = false
            showNotes()
        })
    } else {
        // Remove any note present in editNoteArea
        while (editNoteArea.firstChild) {
            editNoteArea.removeChild(editNoteArea.firstChild);
        }
        // Taking data from show notes section
        let textArea = document.createElement('TEXTAREA')
        textArea.value = document.getElementById(id).innerHTML
        textArea.id = id + 'textArea'
        editNoteArea.append(textArea)
        let saveBtn = document.createElement('button')
        saveBtn.innerHTML = 'Save'
        saveBtn.id = id
        saveBtn.className = 'saveBtn'
        saveBtn.onclick = function() { updateNote(this.id) }
        editNoteArea.append(saveBtn)
    }
}
// Function to update a note, remove the existing note and put a note with new body in front
function updateNote(id) {
    fetch(api)
    .then(response => response.json())
    .then(data => {
        data.splice(id, 1) // removing the old body
        data.unshift({ // putting new one in top
            body:document.getElementById(id + 'textArea').value
        })
        // take out the object, update the new text then put it in first then post
        fetch(api, {
            method: "POST",
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(data => console.log('Data posted : ' + data))
        showNotes()
        document.getElementById('new-note').disabled = false
    })
}
// Function to delete a note
function deleteNote() {
    fetch(api)
    .then(response => response.json())
    .then(data => {
        data.shift()
        fetch(api, {
            method: "POST",
            body: JSON.stringify(data)
        }).then(response => response.json())
        showNotes()
    })
}
// Function to search from notes
function search() {
    if(searchBar.value) {
        // Remove all divs if present having class as note
        while (noteList.firstChild) {
            noteList.removeChild(noteList.firstChild);
        }
        let text = searchBar.value
        fetch(api)
        .then(response => response.json())
        .then(data => {
            for(let i=0; i<data.length; i++) {
                if(data[i]['body'].indexOf(text) !== -1) newNoteCard(i, data[i]['body'])
            }
            if(noteList.firstChild) editNote(noteList.firstChild.firstChild.id) // show 1st note in editNote Area if there is note in notelist
            else {
                while(editNoteArea.firstChild) editNoteArea.removeChild(editNoteArea.firstChild) // remove the textarea if any
            }
        })
    } else showNotes() // if empty show all notes
}
// Function to star a note
// function starNote(id) {
//     fetch(api)
//     .then(response => response.json())
//     .then(data => {
//         let starButton = document.getElementById(id)
//         let index = id.substring(10)
//         if(starButton.className === 'star') { // not starred yet and now make it starred
//             starButton.className = ''
//             starButton.innerHTML = '&#9734;'
//             data[index]['star'] = 0
//         } else { // starred and now make it unstarred
//             starButton.className = 'star'
//             starButton.innerHTML = '&#9733;'
//             let newStarBody = Object.assign({}, data.splice(index,1))[0] // splice returns array from array so converting into object
//             newStarBody['star'] = 1
//             data.unshift(newStarBody)
//             // Object.assign({}, newStarBody.splice(0,1))[0]
//         }
//         // Now Post
//         fetch(api, {
//             method: "POST",
//             body: JSON.stringify(data)
//         })
//         .then(response => response.json())
//         .then(data => console.log(data))
//         showNotes()
//     })
// }