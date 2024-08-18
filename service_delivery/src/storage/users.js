const users = [
    {
      id: 1,
      username: 'user',
      password: '123456',
      displayName: 'demo user',
      emails: [{ value: 'user@mail.ru' }],
    },
    {
      id: 2,
      username: 'jill',
      password: 'birthday',
      displayName: 'Jill',
      emails: [{ value: 'jill@example.com' }],
    },
  ]
  
  exports.addNewUser = function(_user, cb) {
    process.nextTick(function () {

      let user = {}
      user.id = users.length + 1
      user.username = _user.username 
      user.password = _user.password
      user.displayName = _user.displayName
      user.emails = [ { value: _user.email } ] 

      users.push(user)

      if (user) {
        cb(null, user)
      } else {
        cb(new Error('User ' + id + ' does not exist'))
      }
    })
  }

  exports.findById = function (id, cb) {
    process.nextTick(function () {
      const idx = id - 1
      if (users[idx]) {
        cb(null, users[idx])
      } else {
        cb(new Error('User ' + id + ' does not exist'))
      }
    })
  }
  
  exports.findByUsername = function (username, cb) {
    process.nextTick(function () {
      let i = 0, len = users.length
      for (; i < len; i++) {
        const user = users[i]
        if (user.username === username) {
          return cb(null, user)
        }
      }
      return cb(new Error('User ' + username + ' does not exist'))
    })
  }
  
  exports.verifyPassword = (user, password) => {
    return user.password === password
  }