const debug = require('debug')('bree:dynamic-worker-data');

function dynamicWorkerDataPlugin(options = {}) {
  return function(Bree) {
    const originalCreateWorker = Bree.prototype.createWorker;

    Bree.prototype.createWorker = function(filename, options) {
      const originalWorkerData = options.workerData;

      if (typeof originalWorkerData.job.worker?.workerData === 'function') {
        debug('Applying dynamic workerData for job:', originalWorkerData.job.name);
        options = {
          ...options,
          workerData: {
            ...originalWorkerData,
            ...originalWorkerData.job.worker.workerData()
          }
        };
      }

      return originalCreateWorker.call(this, filename, options);
    };
  };
}

module.exports = dynamicWorkerDataPlugin;
