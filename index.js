// Function
function capitalizeLetters(str) {
    let local;
    if(str.includes("-")){
        local = str.split("-");
    }else{
        local = str.split(" ");
    }

    for(let i in local){
        local[i] = local[i][0].toUpperCase() + local[i].substring(1);
    }

    return local.join(" ");
}

function typeSplit(types) {
    return types.map((value) => value.type.name);
}

async function typeWriter(part1, part2) {
    let local1 = part1.split("");
    let local2 = part2.split("");

    document.getElementById("battleText1").innerHTML = "";
    document.getElementById("battleText2").innerHTML = "";
    for(let i = 0; i < local1.length; i++) {
        document.getElementById("battleText1").innerHTML += part1[i];
        await delay(30)
    }

    for(let i = 0; i < local2.length; i++) {
        document.getElementById("battleText2").innerHTML += part2[i];
        await delay(30)
    }
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

async function backButtonFunction(part1, part2) {

    document.getElementById("battleBox1").classList.add("hide2");
    document.getElementById("battleBox2").removeChild(document.getElementById("backButton"));
    document.getElementById("battleBox2").classList.add("flex", "center2", "evenly", "hide2");
    document.getElementById("battleText").classList.remove("hide2");
    document.getElementById("fightButton1").classList.remove("hide2");
    document.getElementById("fightButton2").classList.remove("hide2");
    await typeWriter(part1, part2)
    document.getElementById("battleBox2").classList.remove("hide2");

    const deleteMoveButton = document.getElementById("battleBox1");
    const deleteMoveInfo = document.getElementById("battleBox2");

    while (deleteMoveButton.lastChild && deleteMoveButton.lastChild !== document.getElementsByTagName("p")) {
        deleteMoveButton.lastChild.remove();
    }

    let counter = 4;
    while (deleteMoveInfo.lastChild && deleteMoveInfo.lastChild === document.getElementById(`moveInfoDiv${counter}`)) {
        deleteMoveInfo.lastChild.remove();
        counter--
    }
    counter = 4;
}

// HP countdown
async function hpCountdown(move, yourPoke, enemyPoke, attackerId, allTypes) {

    let attacker;
    let damagedPoke;
    let enemy;
    let hpId;
    let hpBar;
    let maxHp

    // attacker/defender check
    if(attackerId === 0) {
        attacker = yourPoke;
        damagedPoke = enemyPoke;
        enemy = "enemy";
        hpId = document.getElementById("actualHp1");
        hpBar = document.getElementById("hpBarPara1");
    }else{
        attacker = enemyPoke;
        damagedPoke = yourPoke;
        enemy = "you";
        hpId = document.getElementById("actualHp2");
        hpBar = document.getElementById("hpBarPara2");
    }

    // Miss check
    let miss = Math.floor(Math.random() * 100) + 1;

    if(move.accuracy < miss){
        if(enemy === "enemy"){

            await typeWriter(`${capitalizeLetters(attacker.name)} missed`, "");
        }else{

            await typeWriter(`Enemy ${capitalizeLetters(attacker.name)} missed`, "");
        }

        await delay(200);
        return;
    }

    // physical/special questioning
    let damager;
    let defender;
    let stab = 1;
    let crit = 1;
    let z = 100 - Math.floor(Math.random() * 16);
    let type1 = 1;
    let type2 = 1;

    if(move.atkType === "physical") {
        damager = attacker.attack;
        defender = damagedPoke.defense;
    }else{
        damager = attacker.specialAttack;
        defender = damagedPoke.specialDefense;
    }

    // crit check
    if(parseFloat((Math.random() * 100).toFixed(2)) < 4.16){
        crit = 1.5;
        await typeWriter("Critical Hit!", "");
        await delay(200);
    }

    // stab check
    if(attacker.type.includes(move.type)){
        stab = 1.5;
    }

    // effectivness check
    for(let index in damagedPoke.type){

        if(index === "0"){

            if(allTypes[damagedPoke.type[index]].double.map(type => type.name).includes(move.type)){

                type1 = 2;
            }else if(allTypes[damagedPoke.type[index]].half.map(type => type.name).includes(move.type)){

                type1 = 0.5;
            }else if(allTypes[damagedPoke.type[index]].no.map(type => type.name).includes(move.type)){

                type1 = 0;
            }
        }else{

            if(allTypes[damagedPoke.type[index]].double.map(type => type.name).includes(move.type)){

                type2 = 2;
            }else if(allTypes[damagedPoke.type[index]].half.map(type => type.name).includes(move.type)){

                type2 = 0.5;
            }else if(allTypes[damagedPoke.type[index]].no.map(type => type.name).includes(move.type)){
                
                type2 = 0;
            }
        }
    }

    let localDamage = Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(22 * move.damage * (damager/(50 * defender)) + 2) * crit) * (z/100)) * stab) * (type1 * type2));

    if((type1 * type2) === 0){

        await typeWriter("it had no effect...", "");
    }else if((type1 * type2) <= 0.5){

        await typeWriter("it's not very effective...", "");
    }else if((type1 * type2) >= 2){
        
        await typeWriter("It's super effective!", "");
    }

    // damage math
    while(localDamage > 0){
        let localHp = parseFloat(hpId.outerText);

        hpBar.style = `width: ${localHp / damagedPoke.hitpoints * 100}%;`;

        if(localHp / damagedPoke.hitpoints * 100 < 20){
            hpBar.style = `width: ${localHp / damagedPoke.hitpoints * 100}%; background-color: red;`;
        }else if(localHp / damagedPoke.hitpoints * 100 < 50){
            hpBar.style = `width: ${localHp / damagedPoke.hitpoints * 100}%; background-color: rgb(228, 209, 0);`;
        }

        if(localHp > 0){
            hpId.innerText = `${localHp - 1}`;
            localDamage--
            await delay(50);
        }else{
            if(document.getElementById("battleText")){
                if(enemy === "enemy"){

                    await typeWriter(`Enemy ${capitalizeLetters(damagedPoke.name)}`, "fainted!")
                }else{

                    await typeWriter(`${capitalizeLetters(damagedPoke.name)}`, "fainted!")
                }
            }
            await delay(500);
            const deleteArena = document.getElementById("battleArena");

            while (deleteArena.firstChild) {
                deleteArena.firstChild.remove();
            }

            document.getElementById("pokeSelection").classList.remove("hide");
            document.getElementById("showArea").classList.remove("hide");
            document.getElementById("battleArena").classList.add("hide");
            document.getElementById("start").classList.remove("hide");
            document.getElementById("choose").classList.remove("hide");
            document.getElementById("yourPokemon").classList.remove("hide");
            document.getElementById("enemyPokemon").classList.remove("hide");
            document.getElementById("body").classList.remove("BattleBack");
            return;
        }
    }


    // Struggle 
    if(move.name === "struggle"){
        let damageOfStruggle = Math.floor(attacker.hitpoints * 0.25);
        let attackerHp;
        let attackerHpBar;

        // attacker questioning
        if(enemy === "enemy"){
            attackerHp = document.getElementById("actualHp2");
            attackerHpBar = document.getElementById("hpBarPara2");
        }else{
            attackerHp = document.getElementById("actualHp1");
            attackerHpBar = document.getElementById("hpBarPara1");
        }

        // Recoil damage
        while(damageOfStruggle > 0){
           
            if(attackerHp / attacker.hitpoints * 100 < 20){
                attackerHpBar.style = `width: ${attackerHp / attacker.hitpoints * 100}%; background-color: red`;
            }else if(attackerHp / attacker.hitpoints * 100 < 50){
                attackerHpBar.style = `width: ${attackerHp / attacker.hitpoints * 100}%; background-color: rgb(228, 209, 0)`;
            }else{
                attackerHpBar.style = `width: ${attackerHp / attacker.hitpoints * 100}%`;
            }
    
            if(attackerHp > 0){
                attackerHp.innerText = `${attackerHp - 1}`;
                damageOfStruggle--
                await delay(50);
            }else{
                if(document.getElementById("battleText")){
                    if(enemy === "you"){
    
                        await typeWriter(`Enemy ${capitalizeLetters(attacker.name)}`, "fainted!")
                    }else{
    
                        await typeWriter(`${capitalizeLetters(attacker.name)}`, "fainted!")
                    }
                }
                await delay(500);
                const deleteArena = document.getElementById("battleArena");
    
                while (deleteArena.firstChild) {
                    deleteArena.firstChild.remove();
                }
    
                document.getElementById("pokeSelection").classList.remove("hide");
                document.getElementById("showArea").classList.remove("hide");
                document.getElementById("battleArena").classList.add("hide");
                document.getElementById("start").classList.remove("hide");
                document.getElementById("choose").classList.remove("hide");
                document.getElementById("yourPokemon").classList.remove("hide");
                document.getElementById("enemyPokemon").classList.remove("hide");
                document.getElementById("body").classList.remove("BattleBack");
                return;
            }
        }
    }
}

// Move Function
async function moveUsage(move, pokemons, activPoke, enemyMove, allTypes) {
    
    let chosenMove;
    let moveValue;

    if(move === 5){
        moveValue = "struggle";
        pokemons[activPoke[0]].pokeMoves[moveValue] = {
            name: "struggle",
            atkType: "physical",
            power: 50,
            accuracy: 100
        };
    }else{
        chosenMove = document.getElementById(`moveButton${move+1}`);
        moveValue = chosenMove.value;
    }

    document.getElementById("battleBox1").classList.add("hide2");
    document.getElementById("battleBox2").classList.add("hide2");
    document.getElementById("battleText").classList.remove("hide2");

    // Speed check
    let speedChecker = Math.floor(Math.random() * 100) + 1;
    let whoFirst;

    if(pokemons[activPoke[0]].speed === pokemons[activPoke[1]].speed){
        if(speedChecker > 50){
            whoFirst = "you";
        }else{
            whoFirst = "enemy";
        }
    }else if(pokemons[activPoke[0]].speed > pokemons[activPoke[1]].speed) {
        whoFirst = "you";
    }else{
        whoFirst = "enemy"
    }

    // Actual Move Usage into DOM
    if(whoFirst === "you"){
        await typeWriter(`${capitalizeLetters(activPoke[0])} used`, `${capitalizeLetters(moveValue)}!`);
        await delay(200);
        await hpCountdown(pokemons[activPoke[0]].pokeMoves[moveValue], pokemons[activPoke[0]], pokemons[activPoke[1]], 0, allTypes);

        if(document.getElementById("battleText")){

            await delay(500);
            await typeWriter(`Enemy ${capitalizeLetters(activPoke[1])} used`, `${capitalizeLetters(enemyMove.name)}!`);
            await delay(200);
            await hpCountdown(enemyMove, pokemons[activPoke[0]], pokemons[activPoke[1]], 1, allTypes);
            await delay(500);
        }
    }else{
        await typeWriter(`Enemy ${capitalizeLetters(activPoke[1])} used`, `${capitalizeLetters(enemyMove.name)}!`);
        await delay(200);
        await hpCountdown(enemyMove, pokemons[activPoke[0]], pokemons[activPoke[1]], 1, allTypes);
        if(document.getElementById("battleText")){

            await delay(500);
            await typeWriter(`${capitalizeLetters(activPoke[0])} used`, `${capitalizeLetters(moveValue)}!`);
            await delay(200);
            await hpCountdown(pokemons[activPoke[0]].pokeMoves[moveValue], pokemons[activPoke[0]], pokemons[activPoke[1]], 0, allTypes);
            await delay(500);
        }
    }

    if(document.getElementById("battleBox2")){
        document.getElementById("battleBox2").classList.remove("hide2");
    }

}

// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------
// Add pokemon
// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------
async function getData(url, callback) {
    const pokeInfo = await fetch(url);
    const pokeInfoConvert = await pokeInfo.json();
    const moveInfo = await fetch("https://pokeapi.co/api/v2/move/?offset=0&limit=844");
    const moveInfoConvert = await moveInfo.json();
    const typeInfo = await fetch("https://pokeapi.co/api/v2/type/?offset=0&limit=18");
    const typeInfoConvert = await typeInfo.json();

    const pokeData = {};
    const allMoves = {};
    const allTypes = {};

    for (const move of moveInfoConvert.results) {

        const singleMove = await fetch(move.url);
        const singleMoveData = await singleMove.json();
        allMoves[singleMoveData.name] = {
            name : singleMoveData.name,
            type: singleMoveData.type.name,
            atkType: singleMoveData.damage_class.name,
            damage: singleMoveData.power,
            powerpoints: singleMoveData.pp,
            accuracy: singleMoveData.accuracy
        }
    }

    for (const type of typeInfoConvert.results) {

        const singleType = await fetch(type.url);
        const singleTypeData = await singleType.json();
        allTypes[singleTypeData.name] = {
            name : singleTypeData.name,
            double: singleTypeData.damage_relations.double_damage_from,
            half: singleTypeData.damage_relations.half_damage_from,
            no: singleTypeData.damage_relations.no_damage_from
        }
    }

    for (const poke of pokeInfoConvert.results) {

        const mon = await fetch(poke.url);
        const monData = await mon.json();

        const moves = {};
        for(let i = 0; i < monData.moves.length; i++){
            const localName = allMoves[monData.moves[i].move.name];
            if(localName.damage !== null){
                moves[localName.name] = {
                    name : localName.name,
                    type: localName.type,
                    atkType: localName.atkType,
                    damage: localName.damage,
                    powerpoints: localName.powerpoints,
                    accuracy: localName.accuracy
                }
            }
        }

        // const hpFormula = ((2 * baseWert + 31) * 50) / 100 + 50 + 10;
        // const statsFormula = ((2 * baseWert + 31) * 50) / 100 + 5;

        pokeData[monData.name] = {
            name : monData.name,
            type: typeSplit(monData.types),
            hitpoints: Math.floor(((2 * monData.stats[0].base_stat + 31) * 50) / 100 + 50 + 10),
            attack: Math.floor(((2 * monData.stats[1].base_stat + 31) * 50) / 100 + 5),
            defense: Math.floor(((2 * monData.stats[2].base_stat + 31) * 50) / 100 + 5),
            specialAttack: Math.floor(((2 * monData.stats[3].base_stat + 31) * 50) / 100 + 5),
            specialDefense: Math.floor(((2 * monData.stats[4].base_stat + 31) * 50) / 100 + 5),
            speed: Math.floor(((2 * monData.stats[5].base_stat + 31) * 50) / 100 + 5),
            pokeMoves: moves,
            spriteFront: `src/pokemonSprites/FurretTurret/${capitalizeLetters(monData.name)}.gif`,
            battleSpriteFront: `src/pokemonSprites/front/${monData.id}.gif`,
            battleSpriteBack: `src/pokemonSprites/back/${monData.id}.gif`
        }
    }
    
    callback(pokeData, allTypes);
}

getData("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151", createPage);

// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------
// Selection
// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------
function createPage(pokemons, allTypes){

    let obj = document.querySelectorAll("[data-pokemon]");
    for(let poke in pokemons){

        for(let i = 0; i < 2; i++){
            let option = document.createElement("option");
            option.value = pokemons[poke].name;
            option.innerHTML = capitalizeLetters(pokemons[poke].name);
            obj[i].appendChild(option);
        }
    }

    document.getElementById("load").classList.add("hide");
    const activPoke = [];
    
    // Choose button function
    document.getElementById("choose").onclick = () => {
    
        // Deletes previous choses
        if(document.getElementById("pokemonShow") && document.getElementById("chosenNames") && document.getElementById("attacks")){
            document.getElementById("showArea").removeChild(document.getElementById("pokemonShow"));
            document.getElementById("showArea").removeChild(document.getElementById("chosenNames"));
            document.getElementById("showArea").removeChild(document.getElementById("attacks"));
        }
    
        // DOM changes
        document.getElementById("choose").innerHTML = "Change";
        document.getElementById("start").classList.remove("hide");
    
        // Creates pokemon in DOM based of inputs
        let divNames = document.createElement("div");
        let divShow = document.createElement("div");
        divNames.setAttribute("id", "chosenNames");
        divNames.setAttribute("class", "flex between");
        divShow.setAttribute("id", "pokemonShow");
        divShow.setAttribute("class", "flex");
        document.getElementById("showArea").appendChild(divNames);
        document.getElementById("showArea").appendChild(divShow);
    
        for(let i = 0; i < 2; i++){
            let poke = obj[i].value.toLowerCase();
            let div = document.createElement("div");
            let figure = document.createElement("figure");
            let pokeName = document.createElement("h2");
            let img = document.createElement("img");
    
            // Attributes/inner
            div.setAttribute("id", `pokemon${i+1}`);
            div.setAttribute("class", "flex half gap2 showCaseCon center1");
            figure.setAttribute("class", "flex align-end");
            img.setAttribute("src", pokemons[poke].spriteFront);
            pokeName.setAttribute("class", "half textCenter");
            pokeName.setAttribute("id", `pokeName${i+1}`);
            activPoke.splice(i, 1, pokemons[poke].name);
            pokeName.innerHTML = pokemons[poke].name;
    
            // HTML construction
            divShow.appendChild(div);
            divNames.appendChild(pokeName);
            div.appendChild(figure);
            figure.appendChild(img);
        }

        // Create container for choosable attacks
        let divAttacks = document.createElement("div");
        divAttacks.setAttribute("id", "attacks");
        divAttacks.setAttribute("class", "flex gap");
        document.getElementById("showArea").appendChild(divAttacks);
    
        // Create selects of choosable attacks in container
        for(let i = 0; i < 4; i++){

            // selects/container
            let div = document.createElement("div")
            let select = document.createElement("select");
            let type = document.createElement("p");
    
            // Attributes
            div.setAttribute("class", "flex column gap center1 center2");
            select.setAttribute("id", `attack${i+1}`);
            type.setAttribute("id", `info${i+1}`);
            type.setAttribute("class", `infoText`);
            select.setAttribute("class", "attackPKM");
            document.getElementById("attacks").appendChild(div);
            div.appendChild(select);
            div.appendChild(type);
            
            // Create options for selects
            let poke = obj[0].value.toLowerCase();

            for(let atk in pokemons[poke].pokeMoves){
                let option = document.createElement("option");
                option.value = pokemons[poke].pokeMoves[atk].name;
                option.innerHTML = capitalizeLetters(pokemons[poke].pokeMoves[atk].name);
                select.appendChild(option); 
            }
    
            // Info for the attacks
            document.querySelector(`#attack${i+1} option:nth-of-type(${i+1})`).setAttribute("selected", "");

            document.getElementById(`info${i+1}`).innerHTML = `
            Power: ${pokemons[poke].pokeMoves[document.getElementById(`attack${i+1}`).value.toLowerCase()].damage}<br>
            Type: ${capitalizeLetters(pokemons[poke].pokeMoves[document.getElementById(`attack${i+1}`).value.toLowerCase()].type)}<br>
            Accuracy: ${pokemons[poke].pokeMoves[document.getElementById(`attack${i+1}`).value.toLowerCase()].accuracy}`;
            document.getElementById(`attack${i+1}`).onchange = () => {
                document.getElementById(`info${i+1}`).innerHTML = `
                Power: ${pokemons[poke].pokeMoves[document.getElementById(`attack${i+1}`).value.toLowerCase()].damage}<br>
                Type: ${capitalizeLetters(pokemons[poke].pokeMoves[document.getElementById(`attack${i+1}`).value.toLowerCase()].type)}<br>
                Accuracy: ${pokemons[poke].pokeMoves[document.getElementById(`attack${i+1}`).value.toLowerCase()].accuracy}`;
            }     
        }
    }


    // -------------------------------------------------
    // -------------------------------------------------
    // -------------------------------------------------
    // Start Button
    // -------------------------------------------------
    // -------------------------------------------------
    // -------------------------------------------------
    document.getElementById("start").onclick = async () => {

        for(let i = 0; i < 4; i++){

            // Error check for 4 different moves picked
            let localMoveToCheck = document.getElementById(`attack${i+1}`).value;
            for(let j = 0; j < 4; j++){

                let otherMovesToCheck;
                switch(i+1) {
                    case 1:
                        if(j !== 0){
                            otherMovesToCheck = document.getElementById(`attack${j+1}`).value;
                        }
                        break;

                    case 2:
                        if(j !== 1){
                            otherMovesToCheck = document.getElementById(`attack${j+1}`).value;
                        }
                        break;

                    case 3:
                        if(j !== 2){
                            otherMovesToCheck = document.getElementById(`attack${j+1}`).value;
                        }
                        break;

                    case 4:
                        if(j !== 3){
                            otherMovesToCheck = document.getElementById(`attack${j+1}`).value;
                        }
                        break;

                }

                if(localMoveToCheck === otherMovesToCheck){
                    return alert("You need to chose 4 different moves!");
                }
            }
        }

        document.getElementById("pokeSelection").classList.add("hide");
        document.getElementById("showArea").classList.add("hide");
        document.getElementById("battleArena").classList.remove("hide");
        document.getElementById("start").classList.add("hide");
        document.getElementById("choose").classList.add("hide");
        document.getElementById("yourPokemon").classList.add("hide");
        document.getElementById("enemyPokemon").classList.add("hide");
        document.getElementById("body").classList.add("BattleBack");

        // Create battle arena
        const enemyPokeDiv = document.createElement("div");
        const yourPokeDiv = document.createElement("div");
        const backgroundDiv = document.createElement("div");
        const battleTextDiv = document.createElement("div");

        backgroundDiv.setAttribute("class", "battleBackground flex column");
        enemyPokeDiv.setAttribute("class", "battleDiv flex center2 fullsize");
        enemyPokeDiv.setAttribute("id", "pokeDiv1");
        yourPokeDiv.setAttribute("class", "battleDiv flex center2 justify-end fullsize");
        yourPokeDiv.setAttribute("id", "pokeDiv2");
        battleTextDiv.setAttribute("class", "battleTextDiv flex between fullsize");
        document.getElementById("battleArena").classList.add("flex", "column");

        // Create DOM
        document.getElementById("battleArena").appendChild(backgroundDiv)
        backgroundDiv.appendChild(enemyPokeDiv);
        backgroundDiv.appendChild(yourPokeDiv);
        document.getElementById("battleArena").appendChild(battleTextDiv);


        for(let i = 0; i < 2; i++){
            const battleFigure = document.createElement("figure");
            const battlePoke = document.createElement("img");
            const infoDiv = document.createElement("div");
            const nameDiv = document.createElement("div");
            const hpBar = document.createElement("div");
            const hpBarPara = document.createElement("div");
            const hpBarParaBorder = document.createElement("div");
            const pokeName = document.createElement("p");
            const pokeLvl = document.createElement("p");
            const hpCount = document.createElement("p");
            const actualHp = document.createElement("span");
            const maxHp = document.createElement("span");

            // Container all info
            infoDiv.setAttribute("class", "infoContainer flex column align-end");

            // Container name and container hp
            nameDiv.setAttribute("class", "nameContainer fullsize flex between");
            hpBar.setAttribute("class", "hpBar");

            infoDiv.appendChild(nameDiv);
            infoDiv.appendChild(hpBar);

            // Name and level
            nameDiv.appendChild(pokeName);
            nameDiv.appendChild(pokeLvl);

            // actual hpBar inner
            hpBarParaBorder.setAttribute("class", "hpBarBorder");
            hpBarPara.setAttribute("class", "hpBarPara");
            hpBarPara.setAttribute("id", `hpBarPara${i+1}`);
            actualHp.setAttribute("id", `actualHp${i+1}`);
            maxHp.setAttribute("id", `maxHp${i+1}`);
            hpBar.appendChild(hpBarParaBorder);
            hpBarParaBorder.appendChild(hpBarPara);
            infoDiv.appendChild(hpCount);
            hpCount.appendChild(actualHp);
            hpCount.appendChild(maxHp);
            
            if(i === 0){
                
                battleFigure.setAttribute("class", "flex align-end center1");
                battlePoke.setAttribute("src", pokemons[activPoke[1]].battleSpriteFront);
                hpCount.setAttribute("class", "hide2");
                document.getElementById("pokeDiv1").appendChild(infoDiv);
                document.getElementById("pokeDiv1").appendChild(battleFigure);

                // Info into HTML
                pokeName.innerText = `${capitalizeLetters(pokemons[activPoke[1]].name)}`;
                pokeLvl.innerText = "Lv50";
                document.getElementById(`actualHp${i+1}`).innerText = `${pokemons[activPoke[1]].hitpoints}`;
                document.getElementById(`maxHp${i+1}`).innerText = `/${pokemons[activPoke[1]].hitpoints}`;

            }else if(i === 1){

                battleFigure.setAttribute("class", "flex align-end center1");
                battlePoke.setAttribute("src", pokemons[activPoke[0]].battleSpriteBack);
                document.getElementById("pokeDiv2").appendChild(battleFigure);
                document.getElementById("pokeDiv2").appendChild(infoDiv);
                
                // Info into HTML
                pokeName.innerText = `${capitalizeLetters(pokemons[activPoke[0]].name)}`;
                pokeLvl.innerText = "Lv50"
                document.getElementById(`actualHp${i+1}`).innerText = `${pokemons[activPoke[0]].hitpoints}`;
                document.getElementById(`maxHp${i+1}`).innerText = `/${pokemons[activPoke[0]].hitpoints}`;

            }

            battleFigure.appendChild(battlePoke);
        }


        // Battle text div / buttons
        const battleBox1 = document.createElement("div");
        const battleBox2 = document.createElement("div");
        const battleText = document.createElement("p");
        const battleText1 = document.createElement("span");
        const battleText2 = document.createElement("span");
        const battleButton = document.createElement("button");
        const runButton = document.createElement("button");

        // Attributes
        battleBox1.setAttribute("class", "battleBox hide2");
        battleBox1.setAttribute("id", "battleBox1");
        battleBox2.setAttribute("class", "battleBox flex center2 evenly");
        battleBox2.setAttribute("id", "battleBox2");
        battleText.setAttribute("class", "battleText flex column");
        battleText.setAttribute("id", "battleText");
        battleText1.setAttribute("id", "battleText1");
        battleText2.setAttribute("id", "battleText2");
        battleButton.setAttribute("class", "fightButtons");
        battleButton.setAttribute("id", "fightButton1");
        runButton.setAttribute("class", "fightButtons");
        runButton.setAttribute("id", "fightButton2");

        // Values/inner text
        battleButton.innerText = "Fight";
        runButton.innerText = "Run";

        // DOM integration
        battleTextDiv.appendChild(battleText);
        battleTextDiv.appendChild(battleBox1);
        battleText.appendChild(battleText1);
        battleText.appendChild(battleText2);
        battleBox2.appendChild(battleButton);
        battleBox2.appendChild(runButton);
        await typeWriter("What will", `${capitalizeLetters(pokemons[activPoke[0]].name)} do?`);
        battleTextDiv.appendChild(battleBox2);

        // PP Safe your poke
        let localPP1 = pokemons[activPoke[0]].pokeMoves[document.getElementById("attack1").value.toLowerCase()].powerpoints;
        let localPP2 = pokemons[activPoke[0]].pokeMoves[document.getElementById("attack2").value.toLowerCase()].powerpoints;
        let localPP3 = pokemons[activPoke[0]].pokeMoves[document.getElementById("attack3").value.toLowerCase()].powerpoints;
        let localPP4 = pokemons[activPoke[0]].pokeMoves[document.getElementById("attack4").value.toLowerCase()].powerpoints;

        // pp and move safe enemy poke
        let localEnemyMoves = Object.values(pokemons[activPoke[1]].pokeMoves);
        const enemyPokeMoves = [];
        while(enemyPokeMoves.length < 4){
            let randomNum = Math.floor(Math.random() * localEnemyMoves.length);
            if(!enemyPokeMoves.includes(localEnemyMoves[randomNum])){
                enemyPokeMoves.push(localEnemyMoves[randomNum]);
            }
        }

        const enemyPPArr = [];
        enemyPPArr.push(enemyPokeMoves[0]);
        enemyPPArr.push(enemyPokeMoves[1]);
        enemyPPArr.push(enemyPokeMoves[2]);
        enemyPPArr.push(enemyPokeMoves[3]);

        // -------------------------------------------------
        // -------------------------------------------------
        // -------------------------------------------------
        // Fight Button
        // -------------------------------------------------
        // -------------------------------------------------
        // -------------------------------------------------
        battleButton.onclick = () => {

            // DOM swap
            document.getElementById("battleBox2").classList.remove("flex", "center2", "evenly");
            document.getElementById("fightButton1").classList.add("hide2");
            document.getElementById("fightButton2").classList.add("hide2");
            battleText.classList.add("hide2");
            battleBox1.classList.remove("hide2");
            battleBox1.classList.add("flex", "wrap", "center2", "evenly", "gap");

            // Move buttons create
            for(let i = 0; i < 4; i++) {

                const moveButtonDiv = document.createElement("div");
                const moveButton = document.createElement("button");
                const moveInfoDiv = document.createElement("div");
                const moveInfo = document.createElement("p");
                const moveInfoPP = document.createElement("span");
                
                moveButtonDiv.setAttribute("class", `moveButtonDiv`);
                moveInfoDiv.setAttribute("class", `moveInfoDiv hide2`);
                moveInfoDiv.setAttribute("id", `moveInfoDiv${i+1}`);
                moveButton.setAttribute("id", `moveButton${i+1}`);
                moveButton.setAttribute("class", `fightButtons moveButtons`);
                moveButton.value = document.getElementById(`attack${i+1}`).value;
                moveButton.innerText = capitalizeLetters(document.getElementById(`attack${i+1}`).value);

                battleBox1.appendChild(moveButtonDiv);
                moveButtonDiv.appendChild(moveButton);
                battleBox2.appendChild(moveInfoDiv);
                moveInfoDiv.appendChild(moveInfo);

                moveInfo.innerHTML = document.getElementById(`info${i+1}`).outerHTML;
                moveInfo.appendChild(moveInfoPP);

                moveButton.addEventListener("mouseover", mOver, false);
                moveButton.addEventListener("mouseout", mOut, false);

                switch(i+1) {
                    case 1:
                        moveInfoPP.innerText = `PP: ${localPP1}/${pokemons[activPoke[0]].pokeMoves[document.getElementById(`attack${i+1}`).value.toLowerCase()].powerpoints}`;
                        break;

                    case 2:
                        moveInfoPP.innerText = `PP: ${localPP2}/${pokemons[activPoke[0]].pokeMoves[document.getElementById(`attack${i+1}`).value.toLowerCase()].powerpoints}`;
                        break;

                    case 3:
                        moveInfoPP.innerText = `PP: ${localPP3}/${pokemons[activPoke[0]].pokeMoves[document.getElementById(`attack${i+1}`).value.toLowerCase()].powerpoints}`;
                        break;

                    case 4:
                        moveInfoPP.innerText = `PP: ${localPP4}/${pokemons[activPoke[0]].pokeMoves[document.getElementById(`attack${i+1}`).value.toLowerCase()].powerpoints}`;
                        break;

                }

                function mOver() {
                    moveInfoDiv.classList.remove("hide2");
                }

                function mOut() {  
                    moveInfoDiv.classList.add("hide2");
                }

            }

            function sortPP(localPP, move) {
                    
                document.getElementById(`moveButton${move+1}`).onclick = async () => {

                    let randomMove = Math.floor(Math.random() * enemyPPArr.length);
                    let usedMove = enemyPPArr[randomMove];

                    if(enemyPPArr[0].powerpoints !== 0 || enemyPPArr[1].powerpoints !== 0 || enemyPPArr[2].powerpoints !== 0 || enemyPPArr[3].powerpoints !== 0){

                        while(enemyPPArr[randomMove].powerpoints === 0){
                            randomMove = Math.floor(Math.random() * enemyPPArr.length);
                        }
                    }else{
                        usedMove = {
                            name: "struggle",
                            atkType: "physical",
                            power: 50,
                            accuracy: 100
                        };
                    }

                    if(localPP1 === 0 && localPP2 === 0 && localPP3 === 0 && localPP4 === 0){
                        const struggle = 5;

                        await moveUsage(struggle, pokemons, activPoke, usedMove, allTypes);
                        
                        if(document.getElementById("backButton")){
                            backButtonFunction("What will", `${capitalizeLetters(pokemons[activPoke[0]].name)} do?`);
                        }

                    }else if(localPP === 0){
                        document.getElementById("battleBox1").classList.add("hide2");
                        document.getElementById("battleBox2").classList.add("hide2");
                        document.getElementById("battleText").classList.remove("hide2");
                        await typeWriter("Not enought PP", "")
                        await delay(500);
                        document.getElementById("battleBox1").classList.remove("hide2");
                        document.getElementById("battleBox2").classList.remove("hide2");
                        document.getElementById("battleText").classList.add("hide2");

                    }else{

                        switch(move+1) {
                            case 1:
                                localPP1--;
                                enemyPPArr[randomMove].powerpoints--;
                                break;
        
                            case 2:
                                localPP2--;
                                enemyPPArr[randomMove].powerpoints--;
                                break;
        
                            case 3:
                                localPP3--;
                                enemyPPArr[randomMove].powerpoints--;
                                break;
        
                            case 4:
                                localPP4--;
                                enemyPPArr[randomMove].powerpoints--;
                                break;
        

                        }

                        await moveUsage(move, pokemons, activPoke, usedMove, allTypes);
                        
                        if(document.getElementById("backButton")){
                            backButtonFunction("What will", `${capitalizeLetters(pokemons[activPoke[0]].name)} do?`);
                        }
                    }
                }   
            }

            for(let i = 0; i < 4; i++){

                switch(i+1) {
                    case 1:
                        sortPP(localPP1, i);
                        break;

                    case 2:
                        sortPP(localPP2, i);
                        break;

                    case 3:
                        sortPP(localPP3, i);
                        break;

                    case 4:
                        sortPP(localPP4, i);
                        break;

                }
            }
            
            // Back button
            const backButton = document.createElement("button");
            backButton.setAttribute("class", "backButton");
            backButton.setAttribute("id", "backButton");
            backButton.innerHTML = `<i class="fa-solid fa-caret-right"></i>`
            battleBox2.appendChild(backButton);

            document.getElementById("backButton").onclick = () => backButtonFunction("What will", `${capitalizeLetters(pokemons[activPoke[0]].name)} do?`);
        }

        // Run
        runButton.onclick = () => {
            const deleteArena = document.getElementById("battleArena");

            while (deleteArena.firstChild) {
                deleteArena.firstChild.remove();
            }

            document.getElementById("pokeSelection").classList.remove("hide");
            document.getElementById("showArea").classList.remove("hide");
            document.getElementById("battleArena").classList.add("hide");
            document.getElementById("start").classList.remove("hide");
            document.getElementById("choose").classList.remove("hide");
            document.getElementById("yourPokemon").classList.remove("hide");
            document.getElementById("enemyPokemon").classList.remove("hide");
            document.getElementById("body").classList.remove("BattleBack");
        }
    }
}