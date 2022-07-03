const enemyPPArr = [];
enemyPPArr.push(0);
enemyPPArr.push(0);
enemyPPArr.push(0);
enemyPPArr.push(10);


let randomMove = Math.floor(Math.random() * enemyPPArr.length);

while(enemyPPArr[randomMove] === 0){
    randomMove = Math.floor(Math.random() * enemyPPArr.length);
}

console.log(enemyPPArr[randomMove]);
enemyPPArr[randomMove]--
console.log(enemyPPArr[randomMove]);
enemyPPArr[randomMove]--
console.log(enemyPPArr[randomMove]);
enemyPPArr[randomMove]--
console.log(enemyPPArr[randomMove]);