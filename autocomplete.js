function Script(url) {
    this.whenLoadedRun = function(action) {
        var script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';
        script.onload = script.onreadystatechange = function() {
            if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
                action();
            }
        };
        document.body.appendChild(script);

        console.log('loaded url: ' + url);
    };
}

function JQuery() {
    var jQueryVersion = '2.1.0';
    var jQueryCDN = 'https://code.jquery.com/jquery-' + jQueryVersion + '.min.js';

    this.whenLoadedRun = function(action) {
        if (isAlreadyLoaded()) {
            console.log('already have jQuery');
            action();
            return;
        }
        new Script(jQueryCDN).whenLoadedRun(action);
    };

    function isAlreadyLoaded() {
        return window.jQuery && window.jQuery.fn.jquery >= jQueryVersion;
    }
}

function Input(referenceName) {
    this.setValueTo = function(value) {
        $(referenceName).val(value);
        console.log('set [' + referenceName + '] to [' + value + ']');
    };
}

function Button(referenceName) {
    this.click = function() {
        $(referenceName).click();
        console.log('clicked [' + referenceName + ']');
    };
}

var pages = [{
    name: 'page1',
    inputs: [{
        name: "first-input",
        referenceName: '#first-text-input',
        value: 'whatever1'
    }, {
        name: "second-input",
        referenceName: '#second-text-input',
        value: 'whatever2'
    }, {
        name: "first-button",
        referenceName: '#first-button',
        type: 'button'
    }]
}, {
    name: 'page2',
    inputs: [{
        name: "first-input",
        referenceName: '#first-text-input',
        value: 'whatever1'
    }, {
        name: "third-input",
        referenceName: '#third-text-input',
        value: 'whatever3'
    }, {
        name: "first-button",
        referenceName: '#first-button',
        type: 'button'
    }]
}];

function Page(name) {
    function fill(inputs) {
        for (var index = 0; index < inputs.length; index++) {
            var inputToFill = inputs[index];
            var action = inputToFill.type;
            if (!action) {
                new Input(inputToFill.referenceName).setValueTo(inputToFill.value);
            }
            else {
                new Button(inputToFill.referenceName).click();
            }
        }
    }
    
    function findBy(pageName) {
        return $.grep(pages, function findByName(currentPage) {
            return currentPage.name === pageName;
        });    
    }
    
    this.autocomplete = function() {
        var page = findBy(name);
        if(page === undefined) {
            console.log('could not find page [' + name + '] ');
            return;
        }
        fill(page[0].inputs);
    };
}

function autocomplete(pageName) {
    new JQuery().whenLoadedRun(new Page(pageName).autocomplete);
}

// var pageName must be already set
autocomplete(pageName);