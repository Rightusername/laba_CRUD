var selectedListItem = document.getElementsByClassName("selected")[0];

document.getElementById("list").addEventListener('click', function (e) {
    if(e.target.tagName != "LI") return;
    if(e.target == selectedListItem) return;
    var target = e.target;
    selectedListItem.classList.remove('selected');
    target.classList.add('selected');
    selectedListItem = target;

});