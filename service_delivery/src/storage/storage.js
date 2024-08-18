const cBook = require('../classes/cBook')

// Инициализация базы книг
const stor = {

    books: [
        new cBook(
            title       = "The Twelve-Factor App (Русский перевод)", 
            description = "Интересная книга",
            authors     = "",
            favorite    = true,
            fileCover   = "public//books//TFA.html",
            fileName    = "TFA.html",
            fileBook    = "public//books//TFA.html" ),
        new cBook(
            title       = "Совершенный код", 
            description = "Очень хорошая книга",
            authors     = "Макконнелл",
            favorite    = true,
            fileCover   = "public//books//Макконнелл «Совершенный код».pdf",
            fileName    = "Макконнелл «Совершенный код».pdf",
            fileBook    = "public//books//Макконнелл «Совершенный код».pdf" ),
        new cBook(
            title       = "Простоквашино", 
            description = "Отличная книга для детей",
            authors     = "Э. Успенский",
            favorite    = true,
            fileCover   = "err/err/Простоквашино.pdf",
            fileName    = "Простоквашино.pdf",
            fileBook    = "err/err/Простоквашино.pdf" )            
    ],
}

module.exports = stor