require.config({
    paths: {
        vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.32.1/min/vs'
    }
});

window.MonacoEnvironment = {
    getWorkerUrl: function(moduleId, label) {
        return `https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.32.1/min/vs/base/worker/workerMain.js`;
    }
};

let editor;
let socket = io.connect('http://localhost:3000');

require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: `<!DOCTYPE html>
<html>
<head>
    <title>Sample HTML</title>
</head>
<body>
    <h1>Hello, HTMLForge!</h1>
</body>
</html>`,
        language: 'html',
        theme: 'vs-dark',
        automaticLayout: true,
    });

    editor.onDidChangeModelContent(() => {
        socket.emit('codeChange', editor.getValue());
    });

    socket.on('codeUpdate', (newCode) => {
        editor.setValue(newCode);
    });

    document.getElementById('run').addEventListener('click', () => {
        const code = editor.getValue();
        const iframe = document.getElementById('output');
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(code);
        iframe.contentWindow.document.close();
    });

    document.getElementById('upload').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.html,.css,.js';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function(fileEvent) {
                const dataUri = fileEvent.target.result;
                editor.setValue(dataUri);
            };
            reader.readAsText(file);
        };
        input.click();
    });

    document.getElementById('download').addEventListener('click', () => {
        const code = editor.getValue();
        const blob = new Blob([code], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'index.html';
        link.click();
    });

    document.getElementById('runBlank').addEventListener('click', () => {
        const code = editor.getValue();
        const win = window.open('about:blank', '_blank');
        win.document.open();
        win.document.write(code);
        win.document.close();
    });
});
