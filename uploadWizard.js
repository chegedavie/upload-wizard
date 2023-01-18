/**
 * 
 * @param {String} heading 
 * your h* element
 * @param {String} lineDiv 
 * an short empty div with no width styling
 * 
 * set the width of lineDiv to 2/3 of heading
 */

 function underlineHeading(heading,lineDiv){
  const h=document.getElementById(heading),
  l=document.getElementById(lineDiv),
  lw=h.textContent.length*(8)
  l.style.width=lw+'px'
}

function toggleNavbar(){
  const navBar=document.getElementById('navBar')
  navBar.classList.toggle('hidden')
}

underlineHeading('topHeading', 'topHeadingUnderline')

var dropWell = document.getElementById('dropWell')

// We create a class for each node within the list
class Node {
  // Each node has three properties, its value, a pointer that indicates the node that follows and a pointer that indicates the previous node
  constructor (val) {
    this.val = val
    this.next = null
    this.prev = null
  }
}

// We create a class for the list
class DoublyLinkedList {
  // The list has three properties, the head, the tail and the list size
  constructor () {
    this.head = null
    this.tail = null
    this.length = 0
  }
  // The push method takes a value as parameter and assigns it as the tail of the list
  push (val) {
    const newNode = new Node(val)
    if (this.length === 0) {
      this.head = newNode
      this.tail = newNode
    } else {
      this.tail.next = newNode
      newNode.prev = this.tail
      this.tail = newNode
    }
    this.length++
    return this
  }
  // The pop method removes the tail of the list
  pop () {
    if (!this.head) return undefined
    const poppedNode = this.tail
    if (this.length === 1) {
      this.head = null
      this.tail = null
    } else {
      this.tail = poppedNode.prev
      this.tail.next = null
      poppedNode.prev = null
    }
    this.length--
    return poppedNode
  }
  // The shift method removes the head of the list
  shift () {
    if (this.length === 0) return undefined
    const oldHead = this.head
    if (this.length === 1) {
      this.head = null
      this.tail = null
    } else {
      this.head = oldHead.next
      this.head.prev = null
      oldHead.next = null
    }
    this.length--
    return oldHead
  }
  // The unshift method takes a value as parameter and assigns it as the head of the list
  unshift (val) {
    const newNode = new Node(val)
    if (this.length === 0) {
      this.head = newNode
      this.tail = newNode
    } else {
      this.head.prev = newNode
      newNode.next = this.head
      this.head = newNode
    }
    this.length++
    return this
  }
  // The get method takes an index number as parameter and returns the value of the node at that index
  get (index) {
    if (index < 0 || index >= this.length) return null
    if (index === 0) return this.head
    let count, current
    if (index <= this.length / 2) {
      count = 0
      current = this.head
      while (count !== index) {
        current = current.next
        count++
      }
    } else {
      console.log(index, this.length)
      count = this.length - 1
      current = this.tail
      while (count !== index) {
        current = current.prev
        count--
      }
    }
    return current
  }
  // The set method takes an index number and a value as parameters, and modifies the node value at the given index in the list
  set (index, val) {
    var foundNode = this.get(index)
    if (foundNode != null) {
      foundNode.val = val
      return true
    }
    return false
  }
  // The insert method takes an index number and a value as parameters, and inserts the value at the given index in the list
  insert (index, val) {
    if (index < 0 || index > this.length) return false
    if (index === 0) return !!this.unshift(val)
    if (index === this.length) return !!this.push(val)

    var newNode = new Node(val)
    var beforeNode = this.get(index - 1)
    var afterNode = beforeNode.next

    ;(beforeNode.next = newNode), (newNode.prev = beforeNode)
    ;(newNode.next = afterNode), (afterNode.prev = newNode)
    this.length++
    return true
  }

  remove (index) {
    if (index < 0 || index >= this.length) return undefined
    if (index === 0) return this.shift()
    if (index === this.length - 1) return this.pop()
    const previousNode = this.get(index - 1)
    const nextNode = this.get(index + 1)
    const removed = previousNode.next
    previousNode.next = removed.next
    nextNode.prev = removed.prev
    this.length--
    return removed
  }

  list () {
    var n = this.head
    var index = 0
    var listData = []
    while (n != null) {
      listData.push(n.val)
      index += 1
      n = n.next
    }
    //console.log('ls data: '.listData)
    return listData
  }
}

class objectStore {
  constructor () {
    this.DLL_List = new DoublyLinkedList()
    this.row = []
    this.processed = []
    this.grouped = []
    this.ungrouped = []
    this.grouper = createGrouper('Project')
  }

  /**
   * add an onject to the database
   * @param {{type:String,value:String}} object
   */

  add (object) {
    var index = this.DLL_List.length
    try {
      console.log(this.duplicate(object))
      if (this.duplicate(object)) throw new EvalError('Object already exists')
      if (!this.valid(object))
        throw new SyntaxError('object must have type and value properties')
      this.DLL_List.insert(index, object)
      console.log(this.DLL_List, index, object)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Group a number of objects under one object
   * @param  {...any} objects
   */
  group (...objects) {
    var group = { type: '', name: '', value: [] }
    group.name = this.grouper()
    var insertIndex = this.getIndex(objects[0])
    objects.forEach(object => {
      var index = this.getIndex(object)
      group.value.push(object)
      this.DLL_List.remove(index)
    })
    group.type = 'group'
    this.grouped.push(group)
    this.DLL_List.insert(insertIndex, group)
  }

  ungroup (object, index = false) {
    const removed = this.remove(object)
    if (!removed) return
    typeof index === 'number' && this.grouped.splice(index, 1)
    const items = removed.value
    items &&
      items.forEach(item => {
        this.add(item)
      })
  }

  /**
   *
   * @param {*number} index
   * @returns object
   */
  getObject (index) {
    if (this.list().length == 0) return
    return this.DLL_List.get(index).val
  }

  /**
   * delete an object from objects Database
   * @param {object} object
   * @returns object
   */
  remove (object) {
    var index = this.getIndex(object)
    this.DLL_List.remove(index)
    return object
  }

  listGrouped () {
    return this.grouped.map(item => item.name)
  }

  /**
   * Sets the objects index to object.item discarding tha data attribute
   * and 'destructures' the item attribute to be the new object.
   * @param {number} index
   * @returns object
   */
  revert (index) {
    var object = this.getObject(index)
    var rawObject = object.item
    this.DLL_List.set(index, rawObject)
    return object
  }

  /**
   * loops through the Store's list method and returns the index of the match
   * @param {object} object
   * @returns {number} index
   */
  getIndex (object) {
    let objectIndex = -1
    var objects = this.list()
    if (objects.length == 0) return
    console.log(objects)
    if (object.hasOwnProperty('type')) {
      objects.forEach((item, index) => {
         if (object.type == 'url' && item.value == object.value) {
          objectIndex = index
        }
        if (object.type == 'file' && compareObjects(item,object)) {
          objectIndex = index
        }
        if (object.type == 'group' && compareObjects(object, item)) {
          objectIndex = index
        }
         
      })
    } else {
      objects.forEach((item, index) => {
        console.log(object, ' is not an object')
        if (item.type == 'url' && item.value == object) {
          objectIndex = index
        }
        if (item.type == 'file' && item.value.name == object) {
          objectIndex = index
        }
        if (item.type == 'group' && compareObjects(object, item)) {
          objectIndex = index
        }
      })
    }
    return objectIndex
  }

  /**
   * Determines if the object entered already exists in the database and returns true or false
   * @param {object} object
   * @returns {isDuplicate}
   */
  duplicate (object) {
    var isDuplicate = false
    var objects = this.list()
    console.log(objects)
    objects.forEach(obj => {
      if (object.value == obj.value) isDuplicate = true
    })
    return isDuplicate
  }

  /**
   * Checks that an object has Valid syntax before being added
   * ie. and object must have type, value, and name attributes in order to be valid
   * @param {object} object
   * @returns {Boolean}
   */
  valid (object) {
    var objectString = this.stringify(object)
    if (
      object.hasOwnProperty('type') &&
      object.hasOwnProperty('value') &&
      object.hasOwnProperty('name')
    )
      return true
    else {
      if (!object.hasOwnProperty('type'))
        throw new SyntaxError(`${objectString} does not have property type`)
      if (!object.hasOwnProperty('value'))
        throw new SyntaxError(`${objectString} does not have property value`)
      if (!object.hasOwnProperty('name'))
        throw new SyntaxError(`${objectString} does not have property name`)
    }
    return false
  }

  /**
   * loop through the @class Store's @method list()
   * returns all items that do not have a data attribute
   * @returns {unprocessed} []
   */
  syncRaw () {
    var objects = this.list()
    var data = objects.filter(object => {
      if (object.type && object.type === 'group') return false
      if (!object.hasOwnProperty('data')) {
        if (object.type != 'url') return object.name
        else return object.value
      }
      return false
    })
    return data.map(item => {
      return item.name
    })
  }

  unprocessedList () {
    const list = this.list()
    const unprocessed= list.filter(item => {
      if (item.hasOwnProperty('data')) return false
      return true
    })
    console.log(unprocessed)
    return unprocessed
  }

  /**
   * Loops through @method list() and returns all items with a data attribute
   * @returns {[]}
   */
  syncProcessed () {
    var objects = this.list()
    var data = objects.filter(object => {
      if (object.hasOwnProperty('data')) {
        console.log(object)
        if (object.item.type != 'url') {
          return object.item.name
        } else {
          return object.item.value
        }
      }
      return false
    })
    return data
  }

  /**
   * Loops through @method list() and returns all items with a type 'file'
   * @returns {File}
   */
  syncFiles () {
    var objects = this.list()
    var data = objects.filter(object => {
      if (object.type == 'file') {
        return object.name
      }
      return false
    })
    console.log(data, 'data')
    return data.map(item => {
      return item.name
    })
  }

  /**
   * Loops through @method list() and returns all items with a type 'url'
   * @returns {URL}
   */
  syncURLs () {
    var objects = this.list()
    return objects.filter(object => {
      if (object.type == 'url') return object.value
      return false
    })
  }

  /**
   * returns an array of item names
   * @returns {Array}
   */
  syncList () {
    const objects = this.list()
    const raw = objects.filter(object => {
      if (object.hasOwnProperty('data')) return false
      return object.name
    })
    return raw.map(item => item.name)
  }

  /**
   * return all the items in the doubly linked list
   * @returns {[]}
   */
  list () {
    return this.DLL_List.list()
  }

  stringify (object) {
    return JSON.stringify(object)
  }
}

function createGrouper (name) {
  let initial = 1
  return () => {
    const grouper = name + initial
    initial++
    return grouper
  }
}

function compareObjects (objectA, objectB) {
  const unEqual = []

  Object.keys(objectA).forEach(key => {
    if (!objectB.hasOwnProperty(key)) unEqual.push(key)
    else if (objectB[key] !== objectA[key]) unEqual.push(key)
  })

  return unEqual.length === 0
}
const cb = { a: 1, b: 8 }
const ab = { a: 1, b: 2 }
console.log(compareObjects(ab, cb))

var objectsDatabase = new objectStore()

const unGroupObjects = () => {
  const el = this.event.target
  const dataValue = el.attributes.data.value
  const objectIndex = objectsDatabase.listGrouped().indexOf(dataValue)
  const object = objectsDatabase.grouped[objectIndex]
  console.log(dataValue, objectIndex)
  objectsDatabase.ungroup(object, objectIndex)
  console.log(object)
  setUngrouper()
  setGrouper()
}

/**
 * copy files and add border effects
 */
dropWell.addEventListener('dragover', e => {
  e.stopPropagation()
  e.preventDefault()
  const el = document.getElementById('dropWell')
  el.classList.add('border')
  el.style.borderStyle = 'dashed'
  e.dataTransfer.dropEffect = 'copy'
})

/**
 * Receive files and remove border effects
 */
dropWell.addEventListener('drop', e => {
  e.stopPropagation()
  e.preventDefault()
  const el = document.getElementById('dropWell')
  el.classList.remove('border')
  const fileList = e.dataTransfer.files
  for (const file of fileList) {
    objectsDatabase.add({
      type: 'file',
      value: file,
      name: file.name
    })
  }
  const el2 = document.getElementById('uploadResult')
  el2.files = showFiles()
})

/**
 * checks a hidden checkBox and applies check effetcs to a button
 * @param {String} itemId
 * @returns {HTMLElement}
 */
function selectItem (itemId) {
  var item = document.getElementById(itemId)
  var itemParent = item.parentElement
  if (item.checked == true) {
    deselectItem(itemId)
  } else {
    item.checked = true
    var checkIcon = item.nextElementSibling
    itemParent.classList.add('text-indigo-500', 'bg-indigo-100')
    itemParent.classList.remove('bg-gray-200', 'text-gray-800')
    checkIcon.classList.remove('fa-circle')
    checkIcon.classList.add('fa-check-circle')
  }
  return item
}

/**
 * Deselects a hidden checkbox and removes check effects on a button
 * @param {String} itemId
 * @returns {HTMLElement}
 */
function deselectItem (itemId) {
  console.log(itemId, 'deselected')
  var item = document.getElementById(itemId)
  item.checked = false
  var itemParent = item.parentElement
  var checkIcon = item.nextElementSibling
  itemParent.classList.remove('text-indigo-500', 'bg-indigo-100')
  itemParent.classList.add('bg-gray-200', 'text-gray-800')
  checkIcon.classList.add('fa-circle')
  checkIcon.classList.remove('fa-check-circle')
  return item
}

/**
 * 1. Checks all selected checkboxes
 * 2. Loop through the checkboxes
 * 3. For ech box use it's id as the object name
 * 4. get the object index using the filename
 * 5. get the object using index in 4. above
 * 6. Add object to an array of objects
 * 7. pass the groups' array to objectsdatabase's/@class Store() @method group()
 */
function groupObjects () {
  var groupData = []
  var checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked')
  for (let index = 0; index < checkedBoxes.length; index++) {
    const element = checkedBoxes[index]
    var objectName = element.id
    var ungrouped = objectsDatabase.syncRaw()
    var indeks = ungrouped.indexOf(objectName)
    var object = objectsDatabase.getObject(indeks)
    groupData.push(object)
  }
  objectsDatabase.group(...groupData)
  setTimeout(() => {
    resetList()
    setGrouper()
  }, 50)
}

/**
 * refresh the data on the Element with Id fileGrouper
 */
function setGrouper () {
  var grouperDiv = document.getElementById('fileGrouper')
  grouperDiv.setAttribute(
    'x-data',
    '{files:' + JSON.stringify(objectsDatabase.syncRaw()) + '}'
  )
}

function setUngrouper () {
  var grouperDiv = document.getElementById('fileUngrouper')
  grouperDiv.setAttribute(
    'x-data',
    '{files:' + JSON.stringify(objectsDatabase.listGrouped()) + '}'
  )
}

function selected(){
  const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked')
  return checkedBoxes.length>0
}

/**
 * refresh the data on the Element with Id itemsList
 */
function setProcessor () {
  var itemLister = document.getElementById('itemsList')
  itemLister.setAttribute(
    'x-data',
    '{groups:' + JSON.stringify(objectsDatabase.syncList()) + '}'
  )
  //console.log('set ', itemLister)
}

/**
 * Uncheck all the hidden checkboxes using @function deselectItem()
 * @returns {null}
 */
function resetList () {
  var checkBoxes = document.querySelectorAll('input[type="checkbox"]')
  if (!checkBoxes.forEach) {
    if (objectsDatabase.syncRaw() == []) {
      document.getElementById('groupFilesButton').remove()
    }
    return
  }
  checkBoxes.forEach(checkbox => {
    var filename = checkbox.id
    deselectItem(filename)
  })
}

/**
 * Get the data from the edit details form
 * Format the data into an object
 * @returns {object}
 */
function setupData () {
  var dateElement = document.getElementById('date')
  var timeElement = document.getElementById('time')
  var timestampElement = document.getElementById('timestamps')
  var formatElement = document.getElementById('format')
  var languageElement = document.getElementById('language')
  var serviceElement = document.getElementById('service')
  var itemElement = document.getElementById('item')
  var instructionsElement = document.getElementById('instructions')
  var itemData = {
    item: itemElement.value,
    //itemType:
    data: {
      date: dateElement.value,
      time: timeElement.value,
      timestamps: timestampElement.value,
      format: formatElement.value,
      language: languageElement.value,
      service: serviceElement.value
    }
  }
  if (instructionsElement.value.length > 0) {
    itemData.data.instructions = instructionsElement.value
  }

  return itemData
}

/**
 * clears the form
 */
function clearDataForm () {
  document.forms.namedItem('editDetails').reset()
}

function processData () {
  preventDefault()
  const data = setupData()
  const objectIndex = objectsDatabase.syncList().indexOf(data.item)
  const object=objectsDatabase.unprocessedList()[objectIndex]
  const index=objectsDatabase.getIndex(object)
  data.item = object
  objectsDatabase.DLL_List.set(index, data)
  setGrouper()
  setProcessor()
  clearDataForm()
  if (objectsDatabase.syncRaw().length == 0) {
    nextStage()
  }
}

function copyToClipboard (data) {
  navigator.clipboard.writeText(data)
}

function showFiles () {
  var data = objectsDatabase.syncFiles()
  var el = document.getElementById('filesList'),
    el2 = document.getElementById('uploadResult'),
    el3 = document.getElementsByClassName('nextButton')
  setTimeout(() => {
    el.setAttribute('x-data', '{files:' + JSON.stringify(data) + '}')
    el2.classList.remove('hidden')
    for (let index = 0; index < el3.length; index++) {
      const element = el3[index];
      element.classList.remove('hidden')
    }
  }, 400)
}

function showFileProgress (file) {
  const reader = new FileReader()
  reader.addEventListener('progress', event => {
    if (event.loaded && event.total) {
      const percent = (event.loaded / event.total) * 100
    }
  })
  reader.readAsDataURL(file.value)
}

function clickUpload () {
  var el = document.getElementById('normalUpload')
  el.click()
}

function addFiles (element) {
  element.addEventListener('change', e => {
    var fileList = e.target.files
    for (const file of fileList) {
      var fileObject = {
        type: 'file',
        value: file,
        name: file.name
      }
      objectsDatabase.add(fileObject)
      showFiles()
    }
  })
}

function removeFile (file) {
  objectsDatabase.remove(file)
  showFiles()
}

function showURLs () {
  var URLArea = document.getElementById('URLArea')
  el = document.getElementById('nextButton')
  URLArea.setAttribute(
    'x-data',
    '{urls: ' + JSON.stringify(objectsDatabase.syncURLs()) + '}'
  )
  el.classList.remove('hidden')
}

function validateURL(str){
  return str.match(/[a-z]{4,5}\W+\w{3,}\W\w{3,}\W*\w*/)
  
}

function addURL (element) {
  element.addEventListener('keydown', e => {
    try {
      if (e.key == 'Enter') {
        var el = e.target
        var url = {
          type: 'url',
          value: String(el.value),
          name: el.value
        }
        if(!validateURL(url.value)) throw new TypeError('Invalid URL entered!')
        objectsDatabase.add(url)
        e.target.value = ''
        showURLs()
      } else {
        console.log('...typing')
      }
    } catch (error) {
      console.error(error)
      e.target.value = ''
      alert(error)
    }
  })

  //el.value = ''
}

function processDomainName (url) {
  var slugs = url.split('/')
  var domain = slugs[2]
  var domainParts = domain.split('.')
  console.log(domainParts[1])
  return domainParts[1]
}

function setPreview () {
  var preview = document.getElementById('preview')
  preview.setAttribute(
    'x-data',
    '{objects:' + JSON.stringify(objectsDatabase.syncProcessed()) + '}'
  )
}

function removeURL (url) {
  objectsDatabase.remove(url)
  showURLs()
}

function sliceString (str, stop) {
  if (!str) return
  var strLen = str.length
  if (strLen < stop) {
    let diff = stop - strLen
    if (diff > 0) return str.padEnd(diff, ' ')
    return str
  }
  if (strLen == stop) return str
  if (stop - strLen < !3 && strLen - 3 <= stop) return str
  return str.slice(0, stop) + '...'
}


function sliceFilename (str, stop) {
  var strLen = str.length
  var sliced = sliceString(str, stop - 4)
  if (strLen <= stop) return sliced
  return sliced + str.slice(strLen - 4)
}

function parseDate (date, time) {
  return date + ' ' + time
}

function parseService (service) {
  var services = servicesDictionary()

  return services[service]
}

function servicesDictionary () {
  return {
    TR: 'Transcription (TR)',
    CC: 'Closed Captioning (CC)',
    ST: 'Subtitling (ST)',
    I_TR: 'Intergrated TR (I_TR)'
  }
}

function parseLanguage (lang) {
  if (!lang) return
  var languages = languagesDictionary()
  console.log(languages, '<-lang ->', lang)
  return languages[lang]
}

function languagesDictionary () {
  return {
    en_BR: 'English (UK)',
    en_US: 'English (USA)'
  }
}

function parseTimestamps (tmst) {
  if (!tmst) return
  var timestamps = timestampsDictionary()
  return timestamps[tmst]
}

function timestampsDictionary () {
  return {
    '30s': '30 seconds',
    '1m': '1 minute',
    '2m': '2 minutes',
    '5m': '5 minutes'
  }
}

function showRevertButton () {
  var e = this.event
  var btn = revertButton(e)
  btn.classList.remove('hidden')
}

function hideRevertButton () {
  var e = this.event
  var btn = revertButton(e)
  btn.classList.add('hidden')
}

function revertButton (e) {
  var id = e.target.id
  var rawId = id.replace('objectId', '')
  return document.getElementById('buttonId' + rawId)
}

function revertObject () {
  var el = this.event.target
  var dataValue = Number(el.attributes.data.value)
  var object = objectsDatabase.revert(dataValue)
  setUpForm(object)
  setGrouper()
  setProcessor()
  previousStage()
  tab = 2
  console.log(`reverted: ,${objectsDatabase.list()} , ${step}, ${tab}`)
}

function setUpForm (object) {
  var data = object.data
  console.log(data, ' ', object.item)
  document.getElementById('date').value = data.date
  document.getElementById('time').value = data.time
  document.getElementById('timestamps').value = data.timestamps
  document.getElementById('format').value = data.format
  document.getElementById('language').value = data.language
  document.getElementById('service').value = data.service
  document.getElementById('item').value = object.item.name
  document.getElementById('instructions').value = data.instructions || ''
}

addURL(document.getElementById('urlInput'))
//WIZARD STARTS HERE

/**
 * Wizard Step/stage
 */

var step = 1

/**
 * set the wizard to current Step
 *
 */

function syncSteps () {
  var wizardBody = document.getElementById('wizardBody')
  wizardBody.setAttribute('x-data', `{stage:${step}}`)
}

/**
 * go back and forward in the wizard
 */

function preventDefault () {
  e = this.event
  e.preventDefault()
}

function nextStage () {
  preventDefault()
  step++
  if (step == 2) {
    setGrouper()
  }
  if (step == 3) {
    setPreview()
  }
  syncSteps()
}

function previousStage () {
  step--
  syncSteps()
}

// WIZARD ENDS HERE

el2 = document.getElementById('uploadResult')
addFiles(document.getElementById('normalUpload'))

var dataStep3 = [
  {
    item: {
      type: 'file',
      value: {},
      name: 'Pricing example for Bootstrap.html'
    },
    data: {
      date: '2022-10-12',
      time: '14:58',
      timestamps: '1m',
      format: 'verbatim',
      language: 'en_BR',
      service: 'TR',
      instructions:
        'Vestibulum luctus ad rutrum ut posuere cursus elit magna tellus. Inceptos letius sapien magna elementum himenaeos nec. Quam ante commodo ex elit facilisis consequat sem ullamcorper felis.'
    }
  },
  {
    item: { type: 'file', value: {}, name: 'Verbit-logo.svg' },
    data: {
      date: '2022-10-04',
      time: '14:00',
      timestamps: '2m',
      format: 'non-verbatim',
      language: 'en_BR',
      service: 'TR',
      instructions:
        'Duis finibus at curabitur natoque mattis pulvinar. Est cursus vulputate placerat dictumst semper augue tortor platea justo. Maximus ac tellus mi quis consectetur venenatis.'
    }
  },
  {
    item: { type: 'file', value: {}, name: 'Morph & Color Animations.svg' },
    data: {
      date: '',
      time: '',
      timestamps: '',
      format: '',
      language: '',
      service: ''
    }
  },
  {
    item: {
      type: 'file',
      value: {},
      name: 'jQuery Particleground Plugin Demo.html'
    },
    data: {
      date: '',
      time: '',
      timestamps: '',
      format: '',
      language: '',
      service: ''
    }
  },
  {
    item: { type: 'file', value: {}, name: 'rev_logo.svg' },
    data: {
      date: '',
      time: '',
      timestamps: '',
      format: '',
      language: '',
      service: ''
    }
  },
  {
    item: { type: 'file', value: {}, name: 'computer-svgrepo-com (1).svg' },
    data: {
      date: '',
      time: '',
      timestamps: '',
      format: '',
      language: '',
      service: ''
    }
  },
  {
    item: { type: 'file', value: {}, name: 'text-quotes-svgrepo-com.svg' },
    data: {
      date: '',
      time: '',
      timestamps: '',
      format: '',
      language: '',
      service: ''
    }
  },
  {
    item: { type: 'file', value: {}, name: 'computer-svgrepo-com.svg' },
    data: {
      date: '',
      time: '',
      timestamps: '',
      format: '',
      language: '',
      service: ''
    }
  },
  {
    item: {
      type: 'file',
      value: {},
      name: '~$Product Marketing Daily task Template.xlsx'
    },
    data: {
      date: '',
      time: '',
      timestamps: '',
      format: '',
      language: '',
      service: ''
    }
  },
  {
    item: { type: 'file', value: {}, name: '~$Upwork - 1.xlsx' },
    data: {
      date: '',
      time: '',
      timestamps: '',
      format: '',
      language: '',
      service: ''
    }
  },
  {
    item: {
      type: 'url',
      value: 'https://www.facebook.com',
      name: 'https://www.facebook.com'
    },
    data: {
      date: '',
      time: '',
      timestamps: '',
      format: '',
      language: '',
      service: ''
    }
  },
  {
    item: {
      type: 'url',
      value: 'https://www.fack.com',
      name: 'https://www.fack.com'
    },
    data: {
      date: '',
      time: '',
      timestamps: '',
      format: '',
      language: '',
      service: ''
    }
  },
  {
    item: {
      type: 'url',
      value: 'https://www.google.com',
      name: 'https://www.google.com'
    },
    data: {
      date: '',
      time: '',
      timestamps: '',
      format: '',
      language: '',
      service: ''
    }
  }
]
