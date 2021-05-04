const { createInterface } = require('readline');

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Bienvenue sur le script d'installation des node_modules"+
"Assurez vous d'avoir mis vos fichiers sur l'hébergeur SANS le node_modules sinon supprimez le ! "+
"Pour finir soyez sûr d'avoir placez votre package.json"+
"Utilisez vous\n(yarn) - conseillé + rapide\n(npm) - populaire\n+ d'infos https://classic.yarnpkg.com/en/docs/usage\n", (answer) => {

    if(answer !== "yarn" && answer !== "npm"){
        console.log("Mauvaise réponse");
        process.exit(0);
    }

    rl.question("Souhaitez vous installez\n1 - Tous les modules automatiquement (nécessite le package.json)\n2 - Une liste de modules\n", (answer2) => {

        if(answer2 === "1"){

            console.log('t')

            if(answer === "yarn"){
                installModules("yarn");
            } else {
                installModules("npm i");
            }

        } else if(answer2 === "2") {

            rl.question("Donnez votre liste de modules: ", (answer3) => {
                if(answer === "yarn"){
                    installModules("yarn add "+answer3);
                } else {
                    installModules("npm i "+answer3);
                }
            })

        } else {
            process.exit(0);
        }
    })
})

function installModules(command){

    const { exec } = require("child_process");

    console.log("Installing modules !");

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        });
}