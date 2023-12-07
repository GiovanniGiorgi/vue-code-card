# Vue Code Card 
by [@GiovanniGiorgi](https://github.com/GiovanniGiorgi)

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

Define your card in yaml, adding inner template and style.\
Use double brackets {{ }} to resolve variable or JS expression;\
an _'hass'_ object is exposed in the scope, which allows access to all the data of your HA instance.

````YAML
type: custom:vue-code-card
title: Language
default: true
template: |
  <p> {{ title }} - selected: {{ hass.language }} </p>
  <button @click="console.log(hass)">debug</button>
style: |
  .card-content {
    color: red
  }
````

## VUE Directives

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
- `v-effect`
`````html
<div v-scope="{ count: 0 }">
  <div v-effect="$el.textContent = count"></div>
  <button @click="count++">++</button>
</div>
``````
- `v-bind` (including `:` shorthand and class/style special handling)
````html
<img v-bind:src="myUrl">
````
- `v-on` (including `@` shorthand and all modifiers)
- `v-model` (all input types + non-string `:value` bindings)
- `v-show`
- `v-html`
- `v-text`
- `v-pre`
- `v-once`
- `v-cloak`
- `@vue:mounted` & `@vue:unmounted` events

## Custom HA Directives [WIP]

- `v-entity` (specify the type and the entityId)
````html
<div v-entity:switch="input_boolean.test"></div>
```````