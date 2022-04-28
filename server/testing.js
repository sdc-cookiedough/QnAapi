import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    vus: 100,
    duration: '60s',
  };

export default function () {
  http.get(`http://localhost:5050/questions?product_id=${Math.floor(Math.random()*99999)}`);
  http.get(`http://localhost:5050/answers?question=${Math.floor(Math.random()*99999)}`)
  //sleep(1);
}