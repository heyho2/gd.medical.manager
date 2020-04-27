
var validates = {
  url: {
    validate(textval) {
      const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
      return urlregex.test(textval)
    }, message: 'url格式不正确'
  },
  lowerCase: {
    validate(textval) {
      const urlregex = /^[a-z]+$/
      return urlregex.test(textval)
    }, message: '请输入小写字母'
  },
  upperCase: {
    validate(textval) {
      const urlregex = /^[A-Z]+$/
      return urlregex.test(textval)
    },
    message: '请输入大写字母'
  },
  alphabets: {
    validate(textval) {
      const urlregex = /^[A-Za-z]+$/
      return urlregex.test(textval)
    },
    message: '请输入大写或小写字母'
  },

  phone: {
    validate(textval) {
      const urlregex = /^1(3|4|5|7|8|9)\d{9}$/
      return urlregex.test(textval)
    }, message: '手机格式不正确'
  },
  cardNo: {
    validate(textval) {
      // const urlregex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      // return urlregex.test(textval)
      return validateSecIdCard(textval)
    }, message: '身份证格式不正确'
  },
  regName: {
    validate(textval) {
      const urlregex = /^[\u4e00-\u9fa5]{2,4}$/
      return urlregex.test(textval)
    }, message: '真实姓名格式不正确'
  },
  email: {
    validate(textval) {
      const urlregex = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
      return urlregex.test(textval)
    }, message: 'Email格式不正确'
  },
  passwurd: {
    validate(textval) {
      const urlregex = /^[\w_-]{6,16}$/
      return urlregex.test(textval)
    }, message: '密码格式不正确'
  }
}

function elementValidate(rule, value, callback, cObj) {
  if (value) {
    if (!cObj.validate(value)) {
      callback(new Error(cObj.message))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
function validateSecIdCard(value) {
  var iSum = 0
  var sId = value
  var aCity = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙',
    21: '辽宁',
    22: '吉林',
    23: '黑龙',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    83: '台湾',
    91: '国外'
  }
  if (!/^\d{17}(\d|x)$/i.test(sId)) {
    return false
  }
  sId = sId.replace(/x$/i, 'a')
  // 非法地区
  if (aCity[parseInt(sId.substr(0, 2))] == null) {
    return false
  }
  var sBirthday = sId.substr(6, 4) + '-' + Number(sId.substr(10, 2)) +
    '-' + Number(sId.substr(12, 2))
  var d = new Date(sBirthday.replace(/-/g, '/'))
  // 非法生日
  if (sBirthday != (d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d
    .getDate())) {
    return false
  }
  for (var i = 17; i >= 0; i--) {
    iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11)
  }
  if (iSum % 11 != 1) {
    return false
  }
  return true
}

/* 合法uri*/
export function validateUrl(rule, value, callback) {
  elementValidate(rule, value, callback, validates.url)
}

/* 小写字母*/
export function validateLowerCase(rule, value, callback) {
  elementValidate(rule, value, callback, validates.lowerCase)
}

/* 大写字母*/
export function validateUpperCase(rule, value, callback) {
  elementValidate(rule, value, callback, validates.upperCase)
}

/* 大小写字母*/
export function validatAlphabets(rule, value, callback) {
  elementValidate(rule, value, callback, validates.alphabets)
}
/* 手机号码*/
export function validatPhone(rule, value, callback) {
  elementValidate(rule, value, callback, validates.phone)
}
/* 身份证*/
export function validatCardNo(rule, value, callback) {
  elementValidate(rule, value, callback, validates.cardNo)
}
/* 真实姓名 */
export function validatRegName(rule, value, callback) {
  elementValidate(rule, value, callback, validates.regName)
}
/* email */
export function validatEmail(rule, value, callback) {
  elementValidate(rule, value, callback, validates.email)
}
/* 密码 */
export function validatPassword(rule, value, callback) {
  elementValidate(rule, value, callback, validates.passwurd)
}
