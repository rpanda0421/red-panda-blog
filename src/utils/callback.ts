  /**
   * Throttle a function to only be called once every `limit` milliseconds
   * @param callback The function to throttle
   * @param limit The minimum time between invocations
   */
  function throttle(callback: Function, limit: number) {
    var wait = false; // Initially, we're not waiting
    return function () {
      // We return a throttled function
      if (!wait) {
        // If we're not waiting
        callback.call(undefined); // Execute users function
        wait = true; // Prevent future invocations
        setTimeout(function () {
          // After a period of time
          wait = false; // And allow future invocations
        }, limit);
      }
    };
  }