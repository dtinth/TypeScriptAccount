import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('กำลังโหลดข้อมูล...')
  })
})
