/**
 * 有一个异步函数
 * 其他同步函数调用它，如果需要等待它的结果，就需要使用 await
 * 我们需要将其改造成同步函数，并且可以在异步函数结束时获取结果
 * 也就是消除异步传染性
 */

async function asyncFn() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, 1000);
  });
}

async function test1() {
  // other works
  return await asyncFn();
}

async function test2() {
  // other works
  return await test1();
}

async function test3() {
  // other works
  return await test2();
}

function main() {
  const res = test3();
  // 无法获取结果
  console.log(res);
}

/** -------------- 解法 ---------------- */

let asyncFn1 = function () {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("123");
    }, 1000);
  });
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
  console.log(res, "获取成功");
}

function run(func: { (): void; (): void }) {
  let orginalFn = asyncFn1;
  let cacheList: any[] = [];
  let i = 0;
  asyncFn1 = function () {
    if (cacheList[i]) {
      if (cacheList[i].status === "fullfilled") {
        return cacheList[i].data;
      } else if (cacheList[i].status === "rejected") {
        throw cacheList[i].err;
      }
    }
    const result: {
      status: string;
      data: string | null;
      err: string | null;
    } = {
      status: "pending",
      data: null,
      err: null,
    };
    cacheList[i++] = result;
    const prom = orginalFn()
      .then(
        (data) => {
          result.status = "fullfilled";
          result.data = data;
        },
        (err) => {
          result.status = "rejected";
          result.err = err;
        }
      )
      .catch((err) => {
        result.status = "rejected";
        result.err = err;
      });

    throw prom;
  };
  try {
    func();
  } catch (err) {
    if (err instanceof Promise) {
      const reRun = () => {
        i = 0;
        func();
      };
      err.then(reRun, reRun);
    }
  }
}
run(main1);
