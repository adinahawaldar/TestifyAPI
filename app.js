document.addEventListener('DOMContentLoaded', function() {
            const themeToggle = document.getElementById('themeToggle');
            const methodSelect = document.getElementById('methodSelect');
            const jsonBody = document.getElementById('jsonBody');
            const sendRequest = document.getElementById('sendRequest');
            const responseContent = document.getElementById('responseContent');
            const lineNumbers = document.getElementById('lineNumbers');
            const statusCode = document.getElementById('statusCode');
            
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('light-theme');
                themeToggle.textContent = document.body.classList.contains('light-theme') 
                    ? 'Toggle Dark Theme' 
                    : 'Toggle Light Theme';
            });
            
            methodSelect.addEventListener('change', () => {
                const method = methodSelect.value;
                jsonBody.style.display = (method === 'POST' || method === 'PUT') 
                    ? 'block' 
                    : 'none';
            });
            
            sendRequest.addEventListener('click', async () => {
                const method = methodSelect.value;
                const url = document.getElementById('urlInput').value;
                
                if (!url) {
                    showResponse({ error: 'Please enter a URL' }, true);
                    return;
                }
                
                try {
                    let options = {
                        method: method,
                        headers: {}
                    };
                    
                    if ((method === 'POST' || method === 'PUT') && jsonBody.value) {
                        options.body = jsonBody.value;
                        options.headers['Content-Type'] = 'application/json';
                    }
                    
                    const response = await fetch(url, options);
                    const data = await response.json();
                    
                    statusCode.textContent = response.status;
                    statusCode.className = response.status >= 200 && response.status < 300 
                        ? 'status-code status-success' 
                        : 'status-code status-error';
                    
                    showResponse(data);
                } catch (error) {
                    showResponse({ error: error.message }, true);
                }
            });
            
            function showResponse(data, isError = false) {
                const jsonString = JSON.stringify(data, null, 2);
                
                let formattedJson = jsonString
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
                        let cls = 'json-number';
                        if (/^"/.test(match)) {
                            if (/:$/.test(match)) {
                                cls = 'json-key';
                            } else {
                                cls = 'json-string';
                            }
                        } else if (/true|false/.test(match)) {
                            cls = 'json-boolean';
                        } else if (/null/.test(match)) {
                            cls = 'json-null';
                        }
                        return '<span class="' + cls + '">' + match + '</span>';
                    });
                
                responseContent.innerHTML = formattedJson;
                
                const lines = jsonString.split('\n').length;
                let numbers = '';
                for (let i = 1; i <= lines; i++) {
                    numbers += i + '<br>';
                }
                lineNumbers.innerHTML = numbers;
                
                if (isError) {
                    statusCode.textContent = 'Error';
                    statusCode.className = 'status-code status-error';
                }
            }
            
            jsonBody.value = `{
  "title": "foo",
  "body": "bar",
  "userId": 1
}`;
        });