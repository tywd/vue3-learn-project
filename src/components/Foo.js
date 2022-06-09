import {
  h
} from 'vue'
import FooTest from './FooTest.vue'

const Foo = () => {
  return h('div', {}, [
    h('div', {}, 'Foo'),
    h(FooTest, {
      onAddTest (a) {
        console.log('onAddTest', a)
      }
    })
  ])
}
export default Foo
