import http from 'k6/http';
import {check} from 'k6';

export default function () {
    const url = 'https://quickpizza.grafana.com/api/post';

    const payload = JSON.stringify({
        name: 'karan',
        role: 'performance'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const response = http.post(url, payload, params);

    console.log(response.body);

    check (response, {'status is 200': (r) => r.status === 200,});

    const data = response.json();

    check(data, {
        'name is karan': (d) => d.name === 'karan',
        'role is performance': (d) => d.role === 'performance',
    });
}