# Vue Code Card by [@GiovanniGiorgi](https://github.com/GiovanniGiorgi)

## Introduction
Custom Card for [HomeAssistant](home-assistant.io) that supports CSS and HTML with [VUE](https://github.com/vuejs/petite-vue/tree/main) sintax to easly add some logic

## Options

| Name              | Type    | Requirement  | Description                                 | Default             |
| ----------------- | ------- | ------------ | ------------------------------------------- | ------------------- |
| type              | string  | **Required** | `custom:vue-code-card`                      |                     |
| title             | string  | **Optional** | Card name                                   | ``                  |
| template          | string  | **Required** | HTML card content                           | ``                  |
| style             | string  | **Optional** | CSS applied to the card                     | ``                  |
| default           | boolean | **Optional** | use ha-card default layout                  | `true`              |

## Usage

It is possible to resolve the content of a variable or JS expression by inserting it into double brackets {{ }}.\
an _hass_ object is exposed in the scope, which allows access to all the data of your HA instance.

````YAML
type: custom:vue-code-card
title: Language
default: false
template: |
  <p> {{ title }} - selected: {{ hass.language }} </p>
  <button @click="console.log(hass)">debug</button>
style: |
  .card-content {
    color: red
  }
````

## Directives

VUE directives allow to integrate some logic in your code, such as conditionally render or iterate some HTML elements ([petite-vue](https://github.com/vuejs/petite-vue) for reference)

- `v-if` / `v-else` / `v-else-if`
````html
<p v-if="isThis">
  this
</p>
<p v-else>
  that
</p>

``````
- `v-for`
````html
<li v-for="item in items">
  {{ item.message }}
</li>

``````

- `v-bind` (including `:` shorthand and class/style special handling)
- `v-on` (including `@` shorthand and all modifiers)
- `v-model` (all input types + non-string `:value` bindings)
- `v-show`
- `v-html`
- `v-text`
- `v-pre`
- `v-once`
- `v-cloak`
- `v-effect`
- `@vue:mounted` & `@vue:unmounted` events