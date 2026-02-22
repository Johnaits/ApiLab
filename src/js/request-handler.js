export default class RequestHandler {
    
    async execute(url, method, body, customHeaders = {}, proxyUrl = '') {
        try {
            let response;
            
            let headers = { ...customHeaders };

            const methodsWithBody = ['POST', 'PUT', 'PATCH', 'DELETE'];
            if (body && methodsWithBody.includes(method)) {
                if (!headers['Content-Type']) {
                    headers['Content-Type'] = 'application/json';
                }
            }

            const fetchOptions = {
                method: method,
                headers: headers
            };

            if (body && methodsWithBody.includes(method)) {
                fetchOptions.body = body;
            }

            let resultText = "";
            let finalData = "";

            // Execução
            if (proxyUrl) {
                // --- MODO PROXY ---
                response = await fetch(proxyUrl, {
                    method: 'POST',
                    body: JSON.stringify({ 
                        target_url: url, 
                        method: method, 
                        body_content: body,
                        headers: headers 
                    })
                });

                const proxyJson = await response.json();
                
                if (proxyJson.error) {
                    throw new Error(proxyJson.error);
                }

                if (proxyJson.raw_response !== undefined) {
                    finalData = proxyJson.raw_response; // É HTML ou Texto
                } else {
                    finalData = JSON.stringify(proxyJson, null, 4); // É JSON
                }

            } else {
                // --- MODO DIRETO (Navegador) ---
                response = await fetch(url, fetchOptions);
                
                // Lê como texto primeiro!
                resultText = await response.text();

                try {
                    // Tenta converter para JSON
                    const json = JSON.parse(resultText);
                    finalData = JSON.stringify(json, null, 4);
                } catch (e) {
                    // Se falhar, é HTML ou Texto puro
                    finalData = resultText;
                }
            }

            return { success: true, data: finalData };

        } catch (error) {
            return { success: false, error: "Erro: " + error.message };
        }
    }
}