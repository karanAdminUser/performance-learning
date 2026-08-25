import http from 'k6/http';
import { check } from 'k6';

export default function() {
    // Step 1: Ask the server to generate a CSRF token
    const csrfResponse = http.post( 'https://quickpizza.grafana.com/api/csrf-token');

    check (csrfResponse, {'CSRF request status is 200': (r) => r.status === 200,});

    //Step 2: Extract the dynamically generated token
    const csrfToken = csrfResponse.cookies.csrf_token[0].value;
    console.log(`Captured CSRF token: ${csrfToken}`);

    //Step3: Reuse that captured value in another request
    const response = http.get (`https://quickpizza.grafana.com/api/json?csrf=${csrfToken}`);

    const data = response.json();

    console.log(`Returned CSRF token: ${data.csrf}`);

    console.log(`Captured type: ${typeof csrfToken}`);
    console.log(`Returned type: ${typeof data.csrf}`);

    console.log(`Captured raw: ${JSON.stringify(csrfToken)}`);
    console.log(`Returned raw: ${JSON.stringify(data.csrf)}`);

    console.log(`Direct comparison: ${data.csrf === csrfToken}`);

    //Step 4: Verify that the same value was reused
    check(data, {'CSRF token was correlated correctly': (d) => d.csrf === csrfToken,});
}