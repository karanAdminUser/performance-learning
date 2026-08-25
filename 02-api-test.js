import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const response = http.get('https://quickpizza.grafana.com/api/json?name=karan&role=performance');

    const data = response.json();

    check (response, { 'status is 200': (r) => r.status === 200,});
    check (data, { 'name is karan': (d) => d.name === 'karan',
        'role is performance': (d) => d.role === 'performance',
    });
    console.log(data.name);
    console.log(data.role);
}