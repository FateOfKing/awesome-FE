/**
 * 有一个异步函数
 * 其他同步函数调用它，如果需要等待它的结果，就需要使用 await
 * 我们需要将其改造成同步函数，并且可以在异步函数结束时获取结果
 * 也就是消除异步传染性
 */

/** -------------- 解法 ---------------- */

let asyncFn1 = function () {
  return fetch("www.baidu.com");
};

function w1() {
  // other works
  return asyncFn1();
}

function w2() {
  // other works
  return w1();
}

function w3() {
  // other works
  return w2();
}

function main1() {
  const res = w3();
  // 可以获取结果
  console.log(res);
}

function run(func) {
  let orginalFn = window.fetch;
  let cacheList = [];
  let i = 0;
  window.fetch = (...arg) => {
    if (cacheList[i]) {
      if (cacheList[i].status === "fullfilled") {
        return cacheList[i].data;
      } else if (cacheList[i].status === "rejected") {
        throw cacheList[i].err;
      }
    }
    const result = {
      status: "pending",
      data: null,
      err: null,
    };
    cacheList[i++] = result;
    const prom = orginalFn(...arg)
      .then((res) => res.json())
      .then(
        (data) => {
          result.status = "fullfilled";
          result.data = data;
        },
        (err) => {
          result.status = "rejected";
          result.err = err;
        }
      );

    throw prom;
  };
  const execute = () => {
    try {
      // i需要重置。因为fn可能是重新执行的，需要准确获取缓存。(改写后的fetch，类似React的hook，用调用顺序记录不同的state)
      i = 0;
      func();
    } catch (err) {
      // 捕获promise
      if (err instanceof Promise) {
        // 当异步有结果时重新执行fn。
        // 重新执行的fn依旧需要try catch进行错误处理，所以不能单独执行fn。
        // 注意此处并不是递归，只是不断从微任务队列取任务执行。所以不会栈溢出。但是有可能同一事件循环太多任务，导致页面卡顿。
        err.then(execute, execute);
      } else {
        // 将普通错误抛出去
        throw err;
      }
    }
  };

  execute();
}

run(main1);
