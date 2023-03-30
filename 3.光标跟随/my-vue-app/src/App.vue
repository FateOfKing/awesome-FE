<script setup >
import HelloWorld from './components/HelloWorld.vue'
import { ref, reactive, onMounted, onUpdated } from 'vue'
const handleChange = (e) => {
  const textarea = e.target
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

const content = ref('');
const markdown = `<template>
  <div>
    <textarea @input="handleChange" rows="1" class="txt"></textarea>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>
<template>
  <div>
    <textarea @input="handleChange" rows="1" class="txt"></textarea>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template><template>
  <div>
    <textarea @input="handleChange" rows="1" class="txt"></textarea>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template><template>
  <div>
    <textarea @input="handleChange" rows="1" class="txt"></textarea>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>`;
const showCursor = ref(true);
let index = 0;
let timerId = setInterval(() => {
  if (index >= markdown.length) {
    clearInterval(timerId);
    showCursor.value = false;
    return;
  }
  content.value += markdown[index++];
}, 100);
const cursor = reactive({
  posx: 0,
  posy: 0,
});

const contentRef = ref()

function getLastTextNode(dom) {
  const children = dom.childNodes;
  for (let index = children.length - 1; index >= 0; index--) {
    const element = children[index];
    if (element.nodeType === Node.TEXT_NODE && /\S/.test(element.nodeValue)) {
      element.nodeValue = element.nodeValue.replace(/\s+$/, '');
      return element;
    } else if (element.nodeType === Node.ELEMENT_NODE) {
      const last = getLastTextNode(element)
      if (last) {
        return last;
      }

    }
  }
  return null;
}

function updateCursor() {
  const lastText = getLastTextNode(contentRef.value)
  const textNode = document.createTextNode('\u200b');
  if (lastText) {
    lastText.parentElement.appendChild(textNode);
  } else {
    contentRef.value.appendChild(textNode)
  }
  const range = document.createRange()
  range.setStart(textNode, 0);
  range.setEnd(textNode, 0);
  const rect = range.getBoundingClientRect();
  console.log(rect)
  cursor.posx = rect.x;
  cursor.posy = rect.y
  textNode.remove()
}



onMounted(updateCursor);
onUpdated(updateCursor)
</script>

<template>
  <div>
    <textarea @input="handleChange" rows="1" class="txt"></textarea>
    <div>
      <div ref="contentRef">{{ content }} </div>
      <span class="cursor" ref="cursorRef"></span>

    </div>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.txt {
  display: block;
  width: 100%;
  resize: none;
  background: transparent;
  color: inherit;
}

.cursor {
  content: '';
  position: absolute;
  background: #d5d9da;
  animation: toggle 0.6s infinite;
  width: 10px;
  height: 20px;
  transform: translate(3px);
  left: calc(v-bind('cursor.posx') * 1px);
  top: calc(v-bind('cursor.posy') * 1px);
}

@keyframes toggle {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
