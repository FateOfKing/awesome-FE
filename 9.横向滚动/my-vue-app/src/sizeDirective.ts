// sizeDirect.js

const SizeDirective = {
  mounted(el: Element, binding: { value: any }) {
    const callback = binding.value;
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { inlineSize, blockSize } = entry.borderBoxSize[0];

        callback({
          width: inlineSize,
          height: blockSize,
        });
      });
    });
    observer.observe(el);
  },
  unmounted(el: any) {
    // 清除observer实例
    el.__size_observer__.disconnect();
    delete el.__size_observer__;
  },
};

export default SizeDirective;
