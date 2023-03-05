# Crypto Bot Surfer Queue

Service for managing a queue of tasks with a delay between them using RxJS.

## Usage

Install dependencies:

```sh
npm install
```

Start the server:

```js
npm start
```

Replace port with the desired port number.

POST tasks to the /tasks endpoint:

```sh
curl --location --request POST 'http://localhost:<port>/tasks' \
--header 'Content-Type: application/json' \
--data-raw '{
    "task": "<task_data>"
}'
```

Replace PORT with the port number you started the server on, and task_data with the data for the task you want to add to the queue.
