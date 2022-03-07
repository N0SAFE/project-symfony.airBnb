var x = new MutationObserver(function(e) {
    console.log(e[0]);
});

x.observe(document.getElementById('parent'), { childList: true });
document.getElementById('parent').appendChild(document.createElement('div'));

setTimeout(function() {
    document.getElementById('parent').getElementsByTagName("div")[0].remove();
}, 1000)