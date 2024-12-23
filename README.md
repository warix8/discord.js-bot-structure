## discord.js-bot-structure

Cette branche est plus compliqué que les autres, c'est une structure assez complexe pour des bots Discord normalemment assez gros ou multi fonction par ex
Pour bien utiliser cette structure merci d'essayer de lire tous les fichiers pour être à l'aise par la suite avec la structure

## 🌍 Prérequis

Il faudra pour cette branche
- Un assez bon niveau en JavaScript
- Maitrisez les **classes** (Impérativement)


## 🚀 Installation

- Mettre une star ⭐
- Cloner le repository
- Copier et mettre à jour le fichier `.env.example` et le renommer en `.env`
- Exécuter `make start` pour lancer le bot et sa base de données
- Installer les devDependencies avec `npm install` pour votre IDE

> Note pour les utilisateurs de Windows : Vous pouvez exécuter les commandes `make` en utilisant WSL (Windows Subsystem for Linux) ou en utilisant Git Bash. Vous pouvez également exécuter les commandes manuellement ou installer make via Chocolatey (https://chocolatey.org/install) puis `choco install make`.

## 😸 Développement 

### Migrations & Base de données
Lorsque vous développez, vous devrez peut-être modifier le schéma de la base de données. Pour cela, vous devrez suivre ces étapes :
- Modifier le `schema.prisma` pour ajouter ou modifier des tables
- Exécuter la commande `make prisma-migrate` afin de créer une nouvelle migration et de générer les fichiers nécessaires à l'autocomplétion de Prisma
 
> **ATTENTION :** Si vous oubliez de créer une migration, le bot peut ne pas démarrer correctement. Si le bot ne démarre plus, il est impossible d'exécuter la commande `make prisma-migrate`. 
> Pour résoudre ce problème, commentez les lignes de code qui causent l'erreur, exécutez la commande `make prisma-migrate` et décommentez les lignes de code.


## Crédits

- Ca serait sympathique de votre par de mettre sur une commande (botinfo/crédits/help) que vous utiliser cette structure
- Cette structure a été faites par Ota et en partie par Warix
