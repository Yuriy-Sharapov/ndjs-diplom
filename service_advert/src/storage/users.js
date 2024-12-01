const user_list = [
  {
    id           : 1,
    email        : 'user@mail.ru',
    password     : '123456',
    name         : 'user',
    contactPhone : '+79123456789',
  },
  {
    id           : 2,
    email        : 'jill@example.com',
    password     : 'birthday',
    name         : 'jill',
    contactPhone : '+79098765432',
  },
]

const Users = require('../models/users')
const bcrypt = require('bcrypt')
 
async function preloadUsers(){

  try {

      const users_count = await Users.countDocuments()
      console.log(`users_count = ${users_count}`)
      if(users_count !== 0) return;

      console.log(`Нужно инициализировать данные БД Users`)
      for (i = 0; i < user_list.length; i++){
          const user = user_list[i]
          //console.log(user)
           
          const {email, password, name, contactPhone } = user
          
          // получаем соль
          const salt = await bcrypt.genSalt(10)
          // солим и шифруем пароль
          const hash_password = await bcrypt.hash(password, salt)
    
          // console.log(`password - ${password}`)
          // console.log(`salt - ${salt}`)
          // console.log(`hash - ${hash_password}`)    
    
          console.log({email, hash_password, name, contactPhone})
    
          const newUser = Users({
            email       : email,
            passwordHash: hash_password,
            name        : name,
            contactPhone: contactPhone,
          })
              
          await newUser.save()
      }

  } catch (e) {
      console.log(`Ошибка при обращении к коллекции Users`)
      console.log(e)
  }
}

module.exports = preloadUsers