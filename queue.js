import { Observable, interval } from "rxjs";
import { switchMap } from "rxjs/operators";
import fetch from "node-fetch";

const delay = JSON.parse(process.env.DELAY);

const requestQueue$ = interval(delay).pipe(
  switchMap(() => {
    return new Observable((subscriber) => {
      const queue = [];

      const executeRequest = async ({ url, method, headers, body }) => {
        try {
          const response = await fetch(url, { method, headers, body });
          const result = await response.json();
          subscriber.next(result);
        } catch (error) {
          subscriber.error(error);
        }
      };

      const processQueue = () => {
        while (queue.length > 0) {
          const { url, method, headers, body, resultObserver } = queue.shift();

          executeRequest({ url, method, headers, body })
            .then((result) => {
              resultObserver.next(result);
              resultObserver.complete();
            })
            .catch((error) => {
              resultObserver.error(error);
            });
        }
      };

      const addRequest = ({ url, method = "GET", headers = {}, body = {} }) => {
        return new Observable((resultObserver) => {
          const request = { url, method, headers, body, resultObserver };
          queue.push(request);
          processQueue();
        });
      };

      subscriber.next(addRequest);
    });
  })
);

const add = (request) => {
  return requestQueue$.pipe((addRequest) => addRequest(request));
};

export { add };
