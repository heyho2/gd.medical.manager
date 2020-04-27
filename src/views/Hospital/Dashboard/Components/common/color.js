export const colors = function(name) {
  const linearColorList = [{
    hospitalName: '健安',
    start: 'rgba(17,174,225,0.9)',
    end: 'rgba(83,237,255,0.9)',
    text: '#11aee1'
  },
  {
    hospitalName: '中',
    start: 'rgba(253,130,30,1)',
    end: 'rgba(255,211,115,0.9)',
    text: '#fd821e'
  },
  {
    hospitalName: '雪象',
    start: 'rgba(137,6,249,0.9)',
    end: 'rgba(181,95,255,0.9)',
    text: '#8806f9'
  },
  {
    hospitalName: '罗岗',
    start: 'rgba(46 ,76,229,0.9)',
    end: 'rgba(74,168,255,0.9)',
    text: '#2e4ce5'
  },
  {
    hospitalName: '仁康',
    start: 'rgba(87,211,185,0.9)',
    end: 'rgba(131,233,212,0.9)',
    text: '#57d3b9'
  }
  ]
  const colorData = linearColorList.find(a => name.includes(a.hospitalName))
  if (colorData) {
    return colorData
  } else {
    return {
      hospitalName: name,
      start: colorRandom(),
      end: colorRandom(),
      text: colorRandom(1)
    }
  }
}

function colorRandom(a = 0.9) {
  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 255)
  const b = Math.floor(Math.random() * 255)
  return `rgba(${r},${g},${b},${a})`
}
