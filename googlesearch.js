let query = document.querySelector('.query');
let searchText = document.querySelector('.searchText');

function enterkey() {
    if(window.event.keyCode == 13) {
        let url = 'http://www.google.com/search?q=' + query.value;
        this.window.open(url, '_self');
    }
}