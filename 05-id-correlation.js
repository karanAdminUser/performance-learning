import http from 'k6/http';
import { check } from 'k6';

export default function (){

    // STEP 1- Generate a pizza
    const payload = JSON.stringify({
        maxCaloriesPerSlice: 500,
        mustBeVegetarian: false,
        excludedIngredients: ['pepperoni'],
        excludedTools: ['knife'],
        maxNumberOfToppings: 6,
        minNumberOfToppings: 2
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token abcdef0123456789'
        }
    };

    const pizzaResponse = http.post('https://quickpizza.grafana.com/api/pizza',payload,params);

    check(pizzaResponse, {
        'pizza request status is 200': (r) => r.status === 200,
    });

    // STEP 2: Parse the response
    const pizzaData = pizzaResponse.json();
    console.log(JSON.stringify(pizzaData));

    // STEP 3: Capture the dynamically generated Pizza ID
    const pizzaId = pizzaData.pizza.id;

    console.log(`Capitured pizza ID: ${pizzaId}`);

    //STEP 4: Use that ID in another request
    const secondResponse = http.get(`https://quickpizza.grafana.com/api/json?pizzaId=${pizzaId}`);
    const secondData = secondResponse.json();

    console.log(`Returned Pizza ID: ${secondData.pizzaId}`);

    //STEP 5 - Verify correlation
    check(secondData, {
        'pizza ID correlated correctly': (d) => String(d.pizzaId) === String(pizzaId),
    });

}