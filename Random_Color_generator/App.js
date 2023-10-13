let btn = document.querySelector('button');

btn.addEventListener('click', function() {
let h3 = document.querySelector('h3');
let RandomColor = GetRandomColor()
h3.innerText = RandomColor;
console.log(this);

let div = document.querySelector('div');
div.style.backgroundColor = RandomColor
})

function GetRandomColor() {
    let red = Math.floor(Math.random() * 255);
    let green = Math.floor(Math.random() * 255);
    let blue = Math.floor(Math.random() * 255);

    let color = `RGB(${red}, ${green}, ${blue})`;
    return color;

}