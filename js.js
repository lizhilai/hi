var log = console.log.bind(console)
var logMagic = function(text, cssText) {
    var code = '%c'
    var input = text
    var html = code + input
    var css = cssText
    console.log(html, css)
}
var get = function(selector) {
    return document.querySelector(selector)
}
var getAll = function(selector) {
    return document.querySelectorAll(selector)
}
var insertHTML = function(element, position, html) {
    element.insertAdjacentHTML(position, html)
}
var showConsole = function() {
    var text = 'Talk is cheap, \n\tshow me the code.'
    var cssText = `
        color: #fff;
        font-family: verdana;
        font-size: 30px;
        text-shadow: 1px 1px 20px #000;
    `
    logMagic(text, cssText)
}
var ensureBottom = function() {
    var element = get('#chat-content')
    element.scrollTop = element.scrollHeight + element.clientHeight
}
var textShow = function() {
    var text = get('p')
    text.classList.remove('hide')
}
var textHide = function() {
    var text = get('p')
    text.classList.add('hide')
}
var noClickable = function() {
    var element = get('p')
    element.innerHTML = '机器匆忙输入中，请稍后......'
    element.classList.add('noclickable')
    element.removeEventListener('click', textClickCallback)
}
var clickable = function() {
    var element = get('p')
    element.innerHTML = '点击这里说点什么......'
    element.classList.remove('noclickable')
    element.addEventListener('click', textClickCallback)
}
var inputShow = function() {
    var input = get('.chat-input-container')
    input.classList.add('show')
}
var inputHide = function() {
    var input = get('.chat-input-container')
    input.classList.remove('show')
}
var loading = function() {
    var element = get('#chat-content-container')
    var html = `
    <div class="message-item-container message-robot">
        <div class="message-left loading show-in-left" style="height: 42px; width: 80px">
            <ul id="dot-container">
                <li><div class="dot one"></div></li>
                <li><div class="dot two"></div></li>
                <li><div class="dot three"></div></li>
            </ul>
        </div>
    </div>
    `
    element.insertAdjacentHTML('beforeend', html)
    noClickable()
}
var getHeightAndWidth = function(string) {
    var element = get('#chat-content-container')
    var html = `
    <div id="id-container" class="message-item-container message-robot">
        <div id="id-target" class="message-left-noshow">
            ${string}
        </div>
    </div>
    `
    element.insertAdjacentHTML('beforeend', html)
    ensureBottom()
    var container = get('#id-container')
    var target = get('#id-target')
    var result = {}
    result.width = target.offsetWidth
    result.height = target.offsetHeight
    container.remove()
    return result
}
var robotSay = function(string, delay=0) {
    var height = getHeightAndWidth(string).height
    var width = getHeightAndWidth(string).width
    var initHeight = 42
    var initWidth = 80
    // log('height', height, 'width', width)
    setTimeout(function() {
        loading()
        ensureBottom()
        setTimeout(function() {
            var loading = get('.loading')
            loading.style.height = String(height) + "px"
            loading.style.width = String(width) + "px"
            loading.style.transition = "all 0.2s"
            setTimeout(function() {
                loading.innerHTML = string
                ensureBottom()
                loading.classList.remove('loading')
            }, 200)
            clickable()
        }, 1000)
    }, delay)
}
var peopleSay = function(string, delay=0) {
    var element = get('#chat-content-container')
    var html = `
    <div class="message-item-container message-people">
        <div class="message-right show-in-right">${string}</div>
    </div>
    `
    setTimeout(function() {
        element.insertAdjacentHTML('beforeend', html)
        ensureBottom()
    }, delay)
}
var sayHi = function() {
    robotSay('很高兴遇见你！', 500)
    robotSay('你想了解关于我的哪些信息？点击下方提示内容，和我聊聊吧，嘻嘻~', 1700)
}
var insertContextMenu = function() {
    var element = get('body')
    element.addEventListener('contextmenu', function(event) {
        event.preventDefault()
    })
    element.addEventListener('contextmenu', function(event) {
        var top = event.clientY
        var left = event.clientX
        var html = `
            <ul class="context-menu" style="display: block; position: absolute; top: ${top}px; left: ${left}px">
                <li><a href="https://github.com/lizhilai/hi" target="_block">查看源码</a></li>
                <li><a href="https://github.com/lizhilai/hi" target="_block">GitHub</a></li>
            </ul>
        `
        var body = get('body')
        if (get('.context-menu')) {
            var button = get('.context-menu')
            button.remove()
            insertHTML(body, 'beforeend', html)
        } else {
            insertHTML(body, 'beforeend', html)
        }
    })
}
var clickRemoveContextMenu = function() {
    var body = get('body')
    body.addEventListener('click', function(event) {
        if (get('.context-menu')) {
            var element = get('.context-menu')
            element.remove()
        }
    })
}
var onTopicClick = function() {
    var elements = getAll('.chat-input-item')
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i]
        element.addEventListener('click', function(event) {
            inputHide()
            textShow()
            var target = event.target
            var key = target.dataset.key
            log('target', target, 'key', key)
            var question = chatData[key].question
            peopleSay(question, 400)
            var answers = chatData[key].answer
            for (var i = 0; i < answers.length; i++) {
                robotSay(answers[i], 1400 + i * 1800)
            }
        })
    }
}
var textClickCallback = function() {
    textHide()
    inputShow()
}
var onTextClick = function() {
    var text = get('p')
    text.addEventListener('click', textClickCallback)
}
var onCancelButtonClick = function() {
    var button = get('.cancel')
    button.addEventListener('click', function() {
        textShow()
        inputHide()
    })
}
var onEventAll = function() {
    onTopicClick()
    onTextClick()
    onCancelButtonClick()
    insertContextMenu()
    clickRemoveContextMenu()
}
var app = function() {
    showConsole()
    sayHi()
    onEventAll()
}
app()
