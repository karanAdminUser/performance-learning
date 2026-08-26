import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 5,
    duration: '15s',

    thresholds: {
        http_req_duration: ['p(95)<0.200'],
        http_req_failed: ['rate<0.01'],
    },
};

export default function () {

    const response = http.get('http://localhost:8080');

    check(response, {
        'status is 200': (r) => r.status === 200,
    });
}